package helper

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"backend/database"

	jwt "github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// SignedDetails
type SignedDetails struct {
	Email    string
	Username string
	Uid      string
	jwt.RegisteredClaims
}

// Reset password request struct to update new password
type ResetPasswordRequest struct {
	Token       string `json:"token" binding:"required"`
	NewPassword string `json:"new_password" binding:"required"`
}

// Email verification struct for binding email input
type EmailVerificationRequest struct {
	Email string `json:"email" binding:"required,email"`
}

var userCollection *mongo.Collection = database.OpenCollection(database.Client, "user_db", "user_accounts")

var SECRET_KEY string = os.Getenv("SECRET_KEY")

// GenerateAllTokens generates both the detailed token and refresh token
func GenerateAllTokens(email string, username string, uid string) (signedToken string, signedRefreshToken string, err error) {
	claims := &SignedDetails{
		Email:    email,
		Username: username,
		Uid:      uid,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)), // valid for 1 day
		},
	}

	refreshClaims := &SignedDetails{
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(72 * time.Hour)), // valid for 3 days
		},
	}

	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(SECRET_KEY))
	if err != nil {
		log.Panic(err)
		return
	}

	refreshToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims).SignedString([]byte(SECRET_KEY))

	if err != nil {
		log.Panic(err)
		return
	}

	return token, refreshToken, err
}

// ValidateToken validates the jwt token
func ValidateToken(signedToken string) (claims *SignedDetails, msg string) {
	token, err := jwt.ParseWithClaims(
		signedToken,
		&SignedDetails{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(SECRET_KEY), nil
		},
	)

	if err != nil {
		msg = err.Error()
		return
	}

	claims, ok := token.Claims.(*SignedDetails)
	if !ok {
		msg = fmt.Sprintf("the token is invalid")
		msg = err.Error()
		return
	}

	if claims.RegisteredClaims.ExpiresAt.Time.After(time.Now()) {
		msg = fmt.Sprintf("token is expired")
		msg = err.Error()
		return
	}

	return claims, msg
}

// UpdateAllTokens renews the user tokens when they login
func UpdateAllTokens(signedToken string, signedRefreshToken string, userId string) {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

	var updateObj primitive.D

	updateObj = append(updateObj, bson.E{"token", signedToken})
	updateObj = append(updateObj, bson.E{"refresh_token", signedRefreshToken})

	Updated_at, _ := time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
	updateObj = append(updateObj, bson.E{"updated_at", Updated_at})

	upsert := true
	filter := bson.M{"user_id": userId}
	opt := options.UpdateOptions{
		Upsert: &upsert,
	}

	_, err := userCollection.UpdateOne(
		ctx,
		filter,
		bson.D{
			{"$set", updateObj},
		},
		&opt,
	)
	defer cancel()

	if err != nil {
		log.Panic(err)
		return
	}

	return
}
