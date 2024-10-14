package main

import (
	"log"
	"matching-service/internal/controllers"
	"matching-service/internal/services"
	"matching-service/internal/socket"

	"github.com/gin-gonic/gin"
)

func main() {
	// Connect to MongoDB
	services.ConnectToMongo()

	// Connect to RabbitMQ
	err := services.ConnectToRabbitMQ()
	if err != nil {
		log.Fatalf("Failed to connect to RabbitMQ: %v", err)
	}
	defer services.CloseRabbitMQ()

	// Run the WebSocket message handler in the background
	go socket.HandleMessages()

	// Set up Gin router
	router := gin.Default()

	// WebSocket route to handle connections
	router.GET("/ws", socket.HandleConnections)

	// Route for adding users
	router.POST("/addUser", controllers.AddUserHandler)

	// Start the server
	log.Println("Server started on :3002")
	router.Run(":3002")
}
