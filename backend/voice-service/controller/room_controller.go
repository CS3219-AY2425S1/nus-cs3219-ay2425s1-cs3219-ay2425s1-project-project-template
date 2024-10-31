package controller

import (
    "log"
    "math/rand"
    "net/http"
    "sync"
    "time"

    "github.com/gin-gonic/gin"
)

type Room struct {
    Peer1ID string
    Peer2ID string
}

var (
    rooms      = make(map[string]*Room)
    roomsMutex = sync.Mutex{}
)

// JoinRoom handles the request to join a room, generating a unique peer ID
// and returning the connection peer ID if available.
func JoinRoom(c *gin.Context) {
    roomID := c.Param("roomID")
    peerID := generatePeerID()
    log.Println("RoomID:", roomID)

    roomsMutex.Lock()
    defer roomsMutex.Unlock()

    // Create or update room with peer IDs
    if rooms[roomID] == nil {
        rooms[roomID] = &Room{Peer1ID: peerID}
        log.Println("Assigned Peer1ID:", peerID)
    } else if rooms[roomID].Peer1ID != "" && rooms[roomID].Peer2ID == "" && rooms[roomID].Peer1ID != peerID {
        rooms[roomID].Peer2ID = peerID
        log.Println("Assigned Peer2ID:", peerID)
    } else {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Room is full"})
        return
    }

    // Determine the connection peer ID
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

// generatePeerID creates a random unique peer ID
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
