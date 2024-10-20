package main

import (
	"context"
	"fmt"
	"log"
	"matching-service/handlers"
	"matching-service/processes"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
)

func main() {
	// Set up environment
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("err loading: %v", err)
	}
	
	// Setup redis client
	processes.SetupRedisClient()

	// Run a goroutine that matches users
	
	// Routes
	http.HandleFunc("/match", handlers.HandleWebSocketConnections)
	
	// Start the server
	port := os.Getenv("PORT")
	log.Println(fmt.Sprintf("Server starting on :%s", port))
	err = http.ListenAndServe(fmt.Sprintf(":%s", port), nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
