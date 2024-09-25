package main

import (
	"fmt"
	"os"

	middleware "backend/middleware"
	// "backend/middleware"
	routes "backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	port := os.Getenv("PORT")

	if port == "" {
		port = "8000"
	}

	allowedOrigin := fmt.Sprintf("http://localhost:%s", port)
	router := gin.New()
	router.Use(gin.Logger())

	// Apply CORS middleware with custom configuration
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{allowedOrigin},     // Allow any origin, url
		AllowMethods:     []string{"POST", "OPTIONS"}, //For login and sign out methods
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"}, // Headers that can be exposed to the client
		AllowCredentials: true,                       // Allow credentials (cookies, etc.)
		MaxAge:           12 * 60 * 60,
	}))

	routes.UserRoutes(router) // Creates User api routes

	router.Use(middleware.Authentication())

	// API-2
	router.GET("/api-1", func(c *gin.Context) {
		c.JSON(200, gin.H{"success": "Access granted for api-1"})
	})

	// API-1
	router.GET("/api-2", func(c *gin.Context) {
		c.JSON(200, gin.H{"success": "Access granted for api-2"})
	})

	router.Run(":" + port)

}
