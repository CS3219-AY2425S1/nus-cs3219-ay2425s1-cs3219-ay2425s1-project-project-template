package views

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/pion/webrtc/v3"
)

type Room struct {
	Conn1 *websocket.Conn
	Conn2 *websocket.Conn
}

var rooms = make(map[string]*Room)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type SignalingMessage struct {
	Type      string                     `json:"type"`
	Offer     *webrtc.SessionDescription `json:"offer,omitempty"`
	Answer    *webrtc.SessionDescription `json:"answer,omitempty"`
	Candidate *webrtc.ICECandidateInit   `json:"candidate,omitempty"`
}

// WebSocketHandler handles the WebSocket connection for signaling
func WebSocketHandler(w http.ResponseWriter, r *http.Request) {
	roomID := r.URL.Query().Get("roomID")

	// Upgrade HTTP connection to WebSocket
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Failed to upgrade to WebSocket:", err)
		return
	}
	defer ws.Close()

	// Initialize the room if it doesn't exist
	if rooms[roomID] == nil {
		rooms[roomID] = &Room{}
	}

	// Assign the WebSocket connection to Conn1 or Conn2
	var conn *websocket.Conn
	if rooms[roomID].Conn1 == nil {
		rooms[roomID].Conn1 = ws
		conn = rooms[roomID].Conn1
		log.Printf("User connected to Conn1 in room: %s", roomID)
	} else if rooms[roomID].Conn2 == nil {
		rooms[roomID].Conn2 = ws
		conn = rooms[roomID].Conn2
		log.Printf("User connected to Conn2 in room: %s", roomID)
	} else {
		log.Println("Room is full:", roomID)
		return
	}

	// Check if both users are connected
	if rooms[roomID].Conn1 != nil && rooms[roomID].Conn2 != nil {
		log.Println("Both users connected, room:", roomID)
		readyMessage := map[string]string{"type": "ready"}
		readyMessageJSON, _ := json.Marshal(readyMessage)
		rooms[roomID].Conn1.WriteMessage(websocket.TextMessage, readyMessageJSON)
		rooms[roomID].Conn2.WriteMessage(websocket.TextMessage, readyMessageJSON)
	}

	// Wait for signaling messages
	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error reading WebSocket message:", err)
			break
		}

		var signalingMessage SignalingMessage
		err = json.Unmarshal(message, &signalingMessage)
		if err != nil {
			log.Println("Error unmarshalling signaling message:", err)
			continue
		}

		// Hardcoded message forwarding between Conn1 and Conn2
		if rooms[roomID].Conn1 != nil && rooms[roomID].Conn2 != nil {
			var targetConn *websocket.Conn
			if conn == rooms[roomID].Conn1 {
				targetConn = rooms[roomID].Conn2
			} else {
				targetConn = rooms[roomID].Conn1
			}

			if targetConn != nil {
				err = targetConn.WriteMessage(websocket.TextMessage, message)
				if err != nil {
					log.Println("Error forwarding message to peer:", err)
				} else {
					log.Printf("Forwarded message to peer in room: %s", roomID)
				}
			}
		}
	}
}
