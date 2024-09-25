package controllers

import (
	"context"
	"fmt"
	"log"

	"net/http"
	"net/smtp"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"

	"backend/database"

	helper "backend/helpers"
	"backend/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

var userCollection *mongo.Collection = database.OpenCollection(database.Client, "user_db", "user_accounts")
var validate = validator.New()

// HashPassword is used to encrypt the password before it is stored in the DB
func HashPassword(password string) string {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		log.Panic(err)
	}

	return string(bytes)
}

// VerifyPassword checks the input password while verifying it with the passward in the DB.
func VerifyPassword(userPassword string, providedPassword string) (bool, string) {
	err := bcrypt.CompareHashAndPassword([]byte(providedPassword), []byte(userPassword))
	check := true
	msg := ""

	if err != nil {
		msg = fmt.Sprintf("Password is incorrect")
		check = false
	}

	return check, msg
}

// UpdatePasswordInDatabase updates the password to new password in database
func UpdatePasswordInDatabase(userID string, newPassword string) error {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	filter := bson.M{"_id": userID} // Match the user by their ID
	update := bson.D{
		{"$set", bson.D{{"password", newPassword}, {"updated_at", time.Now()}}},
	}

	_, err := userCollection.UpdateOne(ctx, filter, update)
	return err
}

// ClearResetToken clears the reset token once the password is reset
func ClearResetToken(userID string) error {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	update := bson.D{
		{"$unset", bson.D{
			{"reset_token", ""},
			{"reset_token_expiration", ""},
		}},
	}

	_, err := userCollection.UpdateOne(ctx, bson.M{"_id": userID}, update)
	return err
}

// StoreResetTokenInDatabase saves the reset token with an expiration time
func StoreResetTokenInDatabase(userID string, token string) error {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	update := bson.D{
		{"$set", bson.D{
			{"reset_token", token},
			{"reset_token_expiration", time.Now().Add(1 * time.Hour)},
		}},
	}

	_, err := userCollection.UpdateOne(ctx, bson.M{"_id": userID}, update)
	return err
}

// to send the reset email (Replace this with real email service)
func SendResetEmail(email string, token string) {
	resetLink := "http://localhost:8080/v1/reset-password?token=" + token

	// Replace with your SMTP settings (this is just an example using a basic SMTP server)
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"
	authEmail := "noreply.peerprep@gmail.com"
	authPassword := "aezo ivmc mihq wqii"

	// Email message body
	subject := "Subject: Password Reset Request\n"
	body := "To reset your password, please click the following link: " + resetLink + "\n"
	msg := subject + "\n" + body

	// Set up authentication information.
	auth := smtp.PlainAuth("", authEmail, authPassword, smtpHost)

	// Send the email
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, authEmail, []string{email}, []byte(msg))
	if err != nil {
		fmt.Println("Failed to send email:", err)
	} else {
		fmt.Println("Reset email sent to:", email)
	}
}

// CreateUser is the api used to tget a single user
func SignUp() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		var user models.User

		defer cancel()

		if err := c.BindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		validationErr := validate.Struct(user)
		if validationErr != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
			return
		}

		count, err := userCollection.CountDocuments(ctx, bson.M{"email": user.Email}) // checks for duplicate emails
		if err != nil {
			log.Panic(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error occured while checking for the email"})
			return
		}

		password := HashPassword(user.Password)
		user.Password = password

		if count > 0 {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "this email already exists"})
			return
		}

		user.Created_at, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
		user.Updated_at, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
		user.ID = primitive.NewObjectID()
		user.User_id = user.ID.Hex()
		token, refreshToken, _ := helper.GenerateAllTokens(user.Email, user.Username, user.User_id)
		user.Token = token
		user.Refresh_token = refreshToken

		_, insertErr := userCollection.InsertOne(ctx, user)
		if insertErr != nil {
			msg := fmt.Sprintf("User item was not created")
			c.JSON(http.StatusInternalServerError, gin.H{"error": msg})
			return
		}
		defer cancel()

		// send a message to user, successfully created user
		c.JSON(http.StatusOK, gin.H{"message": "User: " + user.Username + " created successfully"})

	}
}

// Login is the api used to tget a single user
func Login() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var user models.User
		var foundUser models.User

		if err := c.BindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		err := userCollection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&foundUser) // finds user with corresponding email from coll

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Email not found"})
			return
		}

		passwordIsValid, msg := VerifyPassword(user.Password, foundUser.Password)

		if !passwordIsValid {
			c.JSON(http.StatusInternalServerError, gin.H{"error": msg})
			return
		}

		token, refreshToken, _ := helper.GenerateAllTokens(foundUser.Email, foundUser.Username, foundUser.User_id)

		helper.UpdateAllTokens(token, refreshToken, foundUser.User_id)

		c.JSON(http.StatusOK, gin.H{"message": "User logged in successfully", "token": token, "refreshToken": refreshToken})
	}
}

// Email verification is the api that handles user email confirmation
func EmailVerification() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req helper.EmailVerificationRequest

		// Bind the request body
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email format"})
			return
		}

		// Check if the email exists in the database
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var user struct {
			Email string
			Uid   string
		}
		err := userCollection.FindOne(ctx, bson.M{"email": req.Email}).Decode(&user)
		if err != nil {
			// Return success even if the email isn't found (to prevent enumeration attacks)
			c.JSON(http.StatusOK, gin.H{"message": "If the email exists, a reset link will be sent"})
			return
		}

		// Generate a reset token (short expiration time)
		token, _, err := helper.GenerateAllTokens(user.Email, "", user.Uid)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error generating reset token"})
			return
		}

		// Save the token to MongoDB with an expiration time (1 hour)
		err = StoreResetTokenInDatabase(user.Uid, token)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error storing reset token"})
			return
		}

		SendResetEmail(user.Email, token)

		c.JSON(http.StatusOK, gin.H{"message": "Reset link sent successfully"})
	}
}

// Reset password is the api to update new password
func ResetPassword() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req helper.ResetPasswordRequest

		// Bind the JSON input (token and new password)
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}

		// Validate the token using tokenHelper
		claims, msg := helper.ValidateToken(req.Token)
		if msg != "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": msg})
			return
		}

		// Retrieve user and check token expiration from MongoDB
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var user struct {
			ResetToken           string    `bson:"reset_token"`
			ResetTokenExpiration time.Time `bson:"reset_token_expiration"`
		}

		err := userCollection.FindOne(ctx, bson.M{"_id": claims.Uid}).Decode(&user)
		if err != nil || user.ResetToken != req.Token || time.Now().After(user.ResetTokenExpiration) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			return
		}

		// Hash the new password
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
			return
		}

		// Update the user's password
		err = UpdatePasswordInDatabase(claims.Uid, string(hashedPassword))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
			return
		}

		// Clear the reset token from the database (prevent reuse)
		ClearResetToken(claims.Uid)

		c.JSON(http.StatusOK, gin.H{"message": "Password reset successfully"})
	}
}
