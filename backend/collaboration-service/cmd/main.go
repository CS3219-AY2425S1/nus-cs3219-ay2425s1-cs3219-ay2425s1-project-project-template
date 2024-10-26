package main

import (
	"collaboration-service/internal/config"
	"collaboration-service/internal/controllers"
	"collaboration-service/internal/messaging"
	"fmt"
	"log"
	"net/http"
	"sync"

	socketio "github.com/googollee/go-socket.io"
	"github.com/golang-jwt/jwt/v4"
)

// Middleware to enable CORS
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// Room and authentication management
var usersAgreedEnd = make(map[string]map[string]bool)
var roomLock sync.Mutex

// Function to simulate JWT access token authentication
func authenticateAccessToken(tokenString string) (*jwt.Token, error) {
	secret := []byte("your-secret-key")
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return secret, nil
	})

	if err != nil || !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return token, nil
}

func main() {
	log.Println("### Application started ###")

	// Initialize MongoDB connection
	log.Println("### Initializing MongoDB ###")
	config.ConnectDB()

	log.Println("### Starting RabbitMQ consumer ###")
	messaging.StartRabbitMQ()

	// Initialize Socket.IO server
	server := socketio.NewServer(nil)

	// Handle socket.io connections
	server.OnConnect("/", func(s socketio.Conn) error {
		log.Printf("New connection: %s", s.ID())
		return nil
	})

	// Middleware for access token validation
	server.OnEvent("/", "authenticate", func(s socketio.Conn, token string) {
		_, err := authenticateAccessToken(token)
		if err != nil {
			log.Println("Authentication failed:", err)
			s.Emit("error", "Authentication failed")
			s.Close()
			return
		}
		s.Emit("authenticated", "Successfully authenticated")
	})

	// Handle room joining and assign question
	server.OnEvent("/", "join-room", func(s socketio.Conn, roomID string, username string) {
		s.Join(roomID)
		log.Printf("User %s joined room %s", username, roomID)

		roomLock.Lock()
		if _, exists := usersAgreedEnd[roomID]; !exists {
			usersAgreedEnd[roomID] = make(map[string]bool)
		}
		roomLock.Unlock()

		s.Emit("room-joined", roomID)
		server.BroadcastToRoom("/", roomID, "user-join", username)
	})

	// Handle user-agreed-end logic
	server.OnEvent("/", "user-agreed-end", func(s socketio.Conn, roomID, userID string) {
		roomLock.Lock()
		usersAgreedEnd[roomID][userID] = true
		if len(usersAgreedEnd[roomID]) == 2 {
			server.BroadcastToRoom("/", roomID, "both-users-agreed-end", roomID)
			usersAgreedEnd[roomID] = make(map[string]bool)
		} else {
			server.BroadcastToRoom("/", roomID, "waiting-for-other-user-end", roomID)
		}
		roomLock.Unlock()
	})

	// Handle disconnect
	server.OnDisconnect("/", func(s socketio.Conn, reason string) {
		log.Printf("User disconnected: %s", s.ID())
		server.BroadcastToRoom("/", s.Context().(string), "user-disconnect", s.ID())
	})

	// Set up routes with CORS middleware
	mux := http.NewServeMux()
	mux.HandleFunc("/authorise-user", controllers.AuthorisedUserHandler)
	mux.HandleFunc("/get-question", controllers.GetQuestionHandler)

	// Socket.IO handler
	mux.Handle("/socket.io/", server)

	// Apply CORS middleware
	handler := enableCORS(mux)

	// Start the socket.io server
	go func() {
		if err := server.Serve(); err != nil {
			log.Fatalf("Socket.io listen error: %s\n", err)
		}
	}()
	defer server.Close()

	log.Println("### Server started on :8080 ###")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
