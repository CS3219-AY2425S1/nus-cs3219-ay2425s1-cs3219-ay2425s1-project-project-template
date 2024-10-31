package main

import (
    "log"
    "math/rand"
    "net/http"
    "sync"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
)

type Room struct {
    Peer1ID string
    Peer2ID string
}

var (
    rooms      = make(map[string]*Room)
    roomsMutex = sync.Mutex{}
)

func main() {
    router := gin.Default()

    // Add CORS middleware to allow requests from localhost:3000
    router.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000"},
        AllowMethods:     []string{"GET", "POST", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge:           12 * time.Hour,
    }))

    // Endpoint to join a room
    router.GET("/join/:roomID", joinRoom)

    log.Println("Starting server on port 8085")
    if err := router.Run(":8085"); err != nil {
        log.Fatalf("Server failed to start: %v", err)
    }
}
// joinRoom generates a unique peer ID and assigns it to a room.
func joinRoom(c *gin.Context) {

    roomID := c.Param("roomID")
    peerID := generatePeerID()
	log.Println((roomID))

    roomsMutex.Lock()
    defer roomsMutex.Unlock()

    // Create or update room with peer IDs
    if rooms[roomID] == nil {
        rooms[roomID] = &Room{Peer1ID: peerID}
		log.Println("peer1ID" + peerID)
    } else if rooms[roomID].Peer1ID != "" && rooms[roomID].Peer2ID == "" && rooms[roomID].Peer1ID != peerID {
        rooms[roomID].Peer2ID = peerID
		log.Println("Peer2Id" +peerID)
    } else {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Room is full"})
        return
    }

    // Respond with peer ID and connection peer if available
    connectionPeerID := ""
    if rooms[roomID].Peer1ID != "" && rooms[roomID].Peer2ID != "" {
        if rooms[roomID].Peer1ID == peerID {
            connectionPeerID = rooms[roomID].Peer2ID
        } else {
            connectionPeerID = rooms[roomID].Peer1ID
        }
    }

    c.JSON(http.StatusOK, gin.H{
        "peerID":           peerID,
        "connectionPeerID": connectionPeerID,
    })
}

func generatePeerID() string {
    rand.Seed(time.Now().UnixNano())
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    length := 10
    result := make([]byte, length)
    for i := range result {
        result[i] = charset[rand.Intn(len(charset))]
    }
    return "peer-" + string(result)
}