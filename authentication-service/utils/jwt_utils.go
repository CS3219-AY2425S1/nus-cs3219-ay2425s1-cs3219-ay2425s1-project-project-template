package utils

import (
	"os"
	"log"
	"time"

	"authentication-service/models"
	"github.com/golang-jwt/jwt"
	"github.com/joho/godotenv"
)

func GenerateToken(user models.UserModel) (string, error) {
	err := godotenv.Load(".env.dev")
    if err != nil {
        log.Fatalf("Error loading .env file")
    }
	var jwtSecret = []byte(os.Getenv("JWT_SECRET_KEY"))
	claims := jwt.MapClaims{
		"email": user.Email,
		"name":  user.Name,
		"exp":   time.Now().Add(time.Hour * 24).Unix(), // Token valid for 24 hours
	}

	// Create the token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token with the secret key
	return token.SignedString(jwtSecret)
}
