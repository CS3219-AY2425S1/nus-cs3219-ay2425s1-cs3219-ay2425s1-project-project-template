package main

import (
	"collaboration-service/internal/config"
	"collaboration-service/internal/controllers"
	"collaboration-service/internal/views"
	"collaboration-service/internal/messaging"
	"log"
	"net/http"
)

// Middleware to enable CORS
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers to allow the frontend to make requests
		w.Header().Set("Access-Control-Allow-Origin", "*") // Allow all origins for simplicity (you can restrict this to a specific origin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// Handle preflight OPTIONS request
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Call the next handler
		next.ServeHTTP(w, r)
	})
}

func main() {
	log.Println("### Application started ###")

	// Initialize MongoDB connection
	log.Println("### Initializing MongoDB ###")
	config.ConnectDB()
	log.Println("### Starting RabbitMQ consumer ###")
	messaging.StartRabbitMQ()
	
	// Set up routes with CORS middleware
	mux := http.NewServeMux()

	mux.HandleFunc("/create-room", controllers.CreateRoomHandler)    // Room creation route
	mux.HandleFunc("/start-p2p", controllers.StartP2PServiceHandler) // Start P2P voice chat route
	mux.HandleFunc("/authorise-user", controllers.AuthorisedUserHandler)
	mux.HandleFunc("/get-question", controllers.GetQuestionHandler)
	mux.HandleFunc("/ws", views.WebSocketHandler)                    // WebSocket signaling route

	// Apply CORS middleware
	handler := enableCORS(mux)

	log.Println("### Server started on :8080 ###")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
