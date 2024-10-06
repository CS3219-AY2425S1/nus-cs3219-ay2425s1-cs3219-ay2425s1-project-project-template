package middleware

import (
	"github.com/golang-jwt/jwt/v4"
	"net/http"
	"os"
	"strings"
)

func VerifyJWT(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get the token from the Authorization header
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header is missing", http.StatusUnauthorized)
			return
		}

		// Split the header to get the token
		tokenString := strings.Split(authHeader, " ")[1]

		// Retrieve the JWT secret from environment variables
		jwtSecret := []byte(os.Getenv("JWT_SECRET"))
		if jwtSecret == nil {
			http.Error(w, "JWT secret is not set", http.StatusInternalServerError)
			return
		}

		// Parse the token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, http.ErrNotSupported
			}
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		// Optionally, you can extract claims from the token and attach them to the request context
		next.ServeHTTP(w, r)
	})
}
