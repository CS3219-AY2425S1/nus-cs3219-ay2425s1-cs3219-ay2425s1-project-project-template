package views

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/pion/webrtc/v3"
)

type Room struct {
	User1    *websocket.Conn
	User2    *websocket.Conn
	Offer    *webrtc.SessionDescription
	IceQueue []webrtc.ICECandidateInit
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
	UserID    string                     `json:"userID"`
}

// WebSocketHandler handles the WebSocket connection for signaling
func WebSocketHandler(w http.ResponseWriter, r *http.Request) {
	roomID := r.URL.Query().Get("roomID")
	userID := r.URL.Query().Get("userID")

	// Upgrade HTTP connection to WebSocket
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Failed to upgrade to WebSocket:", err)
		return
	}
	defer ws.Close()

	// Initialize room if it doesn't exist
	if rooms[roomID] == nil {
		rooms[roomID] = &Room{}
	}

	// Assign WebSocket connection to user
	if userID == "user1" {
		rooms[roomID].User1 = ws
		log.Printf("User1 connected to room: %s", roomID)
	} else if userID == "user2" {
		rooms[roomID].User2 = ws
		log.Printf("User2 connected to room: %s", roomID)
	}

	log.Printf("Room state after connection: %+v", rooms[roomID])

	// Wait for signaling messages
	for {
		_, message, err := ws.ReadMessage()
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

		// Handle offer from user1
		if signalingMessage.Type == "offer" && userID == "user1" {
			rooms[roomID].Offer = signalingMessage.Offer
			log.Printf("Received offer from user1: %+v", signalingMessage)
			if rooms[roomID].User2 != nil {
				err = rooms[roomID].User2.WriteMessage(websocket.TextMessage, message)
				if err != nil {
					log.Println("Error forwarding offer to user2:", err)
				} else {
					log.Printf("Forwarding offer to user2 in room: %s", roomID)
				}
			} else {
				log.Printf("Message from user1 could not be routed; missing peer in room %s", roomID)
			}
		}

		// Handle answer from user2
		if signalingMessage.Type == "answer" && userID == "user2" {
			if signalingMessage.Answer != nil && signalingMessage.Answer.SDP != "" {
				log.Printf("Received answer from user2: %+v", signalingMessage)
				if rooms[roomID].User1 != nil {
					err = rooms[roomID].User1.WriteMessage(websocket.TextMessage, message)
					if err != nil {
						log.Println("Error forwarding answer to user1:", err)
					} else {
						log.Printf("Forwarding answer to user1 in room: %s", roomID)
					}
				}
			} else {
				log.Println("Invalid answer received from user2.")
			}
		}

		// Handle ICE candidates
		if signalingMessage.Type == "ice" {
			log.Printf("Received ICE candidate from %s: %+v", userID, signalingMessage)

			if userID == "user1" && rooms[roomID].User2 != nil {
				err = rooms[roomID].User2.WriteMessage(websocket.TextMessage, message)
				if err != nil {
					log.Println("Error forwarding ICE candidate to user2:", err)
				} else {
					log.Printf("Forwarding ICE candidate to user2 in room: %s", roomID)
				}
			} else if userID == "user2" && rooms[roomID].User1 != nil {
				err = rooms[roomID].User1.WriteMessage(websocket.TextMessage, message)
				if err != nil {
					log.Println("Error forwarding ICE candidate to user1:", err)
				} else {
					log.Printf("Forwarding ICE candidate to user1 in room: %s", roomID)
				}
			} else {
				log.Printf("ICE candidate could not be routed; missing peer in room %s", roomID)
			}
		}
	}
}
