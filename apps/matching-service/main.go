package main

import (
	"fmt"
	"log"
	"matching-service/handlers"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	// Set up environment
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("err loading: %v", err)
	}
	port := os.Getenv("PORT")

	// Routes
	http.HandleFunc("/match", handlers.HandleWebSocketConnections)

	// Start the server
	log.Println(fmt.Sprintf("Server starting on :%s", port))
	err = http.ListenAndServe(fmt.Sprintf(":%s", port), nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
