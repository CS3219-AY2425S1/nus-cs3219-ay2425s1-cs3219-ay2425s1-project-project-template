package handlers

import (
	"context"
	"encoding/json"
	"log"
	"matching-service/databases"
	"matching-service/models"
	"matching-service/processes"
	"matching-service/utils"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/redis/go-redis/v9"
)

var (
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			// Allow all connections by skipping the origin check (set more restrictions in production)
			return true
		},
	}
)

// handleConnections manages WebSocket connections and matching logic.
func HandleWebSocketConnections(w http.ResponseWriter, r *http.Request) {
	rdb := databases.GetRedisClient()
	ctx := context.Background()

	// TODO: Parse the authorization header to validate the JWT token and get the user ID claim.

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Could not open websocket connection", http.StatusBadRequest)
		return
	}
	defer func() {
		if closeErr := ws.Close(); closeErr != nil {
			log.Printf("WebSocket close error: %v", closeErr)
		}
	}()

	log.Printf("WebSocket connection established for port %s", utils.ExtractWebsocketPort(ws))

	matchRequest, err := readMatchRequest(ws)
	if err != nil {
		log.Printf("Error reading match request: %v", err)
		return
	}

	// TODO: Checks if user is already an existing websocket connection

	// Subscribes to a channel that returns a message if a match is found
	matchFoundPubsub := rdb.Subscribe(ctx, matchRequest.Username)
	defer matchFoundPubsub.Close()

	// Create a context for user cancellation
	userCtx, userCancel := context.WithCancel(ctx)
	defer userCancel() // Ensure cancel is called to release resources

	// Create a context for matching timeout
	timeoutCtx, timeoutCancel, err := utils.CreateTimeoutContext()
	if err != nil {
		log.Printf("Error creating timeout context: %v", err)
		return
	}
	defer timeoutCancel()

	// Start goroutines for handling messages and performing matching.
	go processes.ReadMessages(ws, userCancel)
	go processes.PerformMatching(matchRequest, ctx) // Perform matching

	// Wait for a match, timeout, or cancellation.
	waitForResult(ws, userCtx, timeoutCtx, matchFoundPubsub, matchRequest.Username)
}

// readMatchRequest reads the initial match request from the WebSocket connection.
func readMatchRequest(ws *websocket.Conn) (models.MatchRequest, error) {
	var matchRequest models.MatchRequest
	if err := ws.ReadJSON(&matchRequest); err != nil {
		return matchRequest, err
	}

	log.Printf("Received match request: %v from client port: %s", matchRequest, utils.ExtractWebsocketPort(ws))
	return matchRequest, nil
}

// Cleans up the data associated with the user before ending the websocket connection.
// If user is already removed, then nothing happens.
// This function is unaffected by the external context.
func cleanUpUser(username string) {
	redisClient := databases.GetRedisClient()
	ctx := context.Background()

	err := redisClient.Watch(ctx, func(tx *redis.Tx) error {
		// Cleanup Redis
		databases.CleanUpUser(tx, username, ctx)
		return nil
	})
	if err != nil {
		return
	}
}

// waitForResult waits for a match result, timeout, or cancellation.
func waitForResult(ws *websocket.Conn, userCtx, timeoutCtx context.Context, matchFoundPubsub *redis.PubSub, username string) {
	select {
	case <-userCtx.Done():
		log.Printf("Matching cancelled for port %v", utils.ExtractWebsocketPort(ws))
		cleanUpUser(username)
		return
	case <-timeoutCtx.Done():
		log.Printf("Connection timed out for port %v", utils.ExtractWebsocketPort(ws))
		sendTimeoutResponse(ws)
		cleanUpUser(username)
		return
	case msg, ok := <-matchFoundPubsub.Channel():
		if !ok {
			// Channel closed without a match, possibly due to context cancellation
			log.Println("Match found channel closed without finding a match")
			return
		}
		var result models.MatchFound
		// Unmarshal the JSON message into the struct
		err := json.Unmarshal([]byte(msg.Payload), &result)
		if err != nil {
			log.Printf("Error unmarshaling JSON: %v", err)
			return
		}

		log.Println("Match found for user: " + username)

		// Notify the user about the match
		sendMatchFoundResponse(ws, result.User, result)
		return
	}
}
