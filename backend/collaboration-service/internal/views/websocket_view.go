package views

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/pion/webrtc/v3"
)

// SignalingMessage represents the signaling data sent via WebSockets
type SignalingMessage struct {
	Type      string                     `json:"type"`
	Offer     *webrtc.SessionDescription `json:"offer,omitempty"`
	Answer    *webrtc.SessionDescription `json:"answer,omitempty"`
	Candidate *IceCandidate              `json:"candidate,omitempty"`
}

// IceCandidate represents ICE candidate information
type IceCandidate struct {
	Candidate     string `json:"candidate"`
	SdpMid        string `json:"sdpMid"`
	SdpMLineIndex uint16 `json:"sdpMLineIndex"`
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func WebSocketHandler(w http.ResponseWriter, r *http.Request) {
	// Upgrade HTTP connection to WebSocket
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Failed to upgrade to WebSocket:", err)
		return
	}
	defer ws.Close()

	// Set up WebRTC peer connection
	peerConnection, err := webrtc.NewPeerConnection(webrtc.Configuration{})
	if err != nil {
		log.Println("Failed to create peer connection:", err)
		return
	}
	defer peerConnection.Close()

	handleSignaling(ws, peerConnection)
}

// Handle signaling messages between peers (SDP, ICE)
func handleSignaling(ws *websocket.Conn, peerConnection *webrtc.PeerConnection) {
	for {
		_, message, err := ws.ReadMessage()
		if err != nil {
			log.Println("Error reading WebSocket message:", err)
			return
		}

		// Unmarshal the received message
		var signalingMessage SignalingMessage
		err = json.Unmarshal(message, &signalingMessage)
		if err != nil {
			log.Println("Error unmarshalling signaling message:", err)
			continue
		}

		// Handle ICE candidates
		if signalingMessage.Type == "ice" && signalingMessage.Candidate != nil {
			iceCandidate := webrtc.ICECandidateInit{
				Candidate:     signalingMessage.Candidate.Candidate,
				SDPMid:        &signalingMessage.Candidate.SdpMid,
				SDPMLineIndex: &signalingMessage.Candidate.SdpMLineIndex,
			}
			err = peerConnection.AddICECandidate(iceCandidate)
			if err != nil {
				log.Println("Error adding ICE candidate:", err)
			}
		}

		// Handle SDP offer
		if signalingMessage.Type == "offer" && signalingMessage.Offer != nil {
			err := peerConnection.SetRemoteDescription(*signalingMessage.Offer)
			if err != nil {
				log.Println("Error setting remote description:", err)
				return
			}

			// Create answer and send it back
			answer, err := peerConnection.CreateAnswer(nil)
			if err != nil {
				log.Println("Error creating answer:", err)
				return
			}
			err = peerConnection.SetLocalDescription(answer)
			if err != nil {
				log.Println("Error setting local description:", err)
				return
			}

			answerMessage := SignalingMessage{Type: "answer", Answer: &answer}
			ws.WriteJSON(answerMessage)
		}

		// Handle SDP answer
		if signalingMessage.Type == "answer" && signalingMessage.Answer != nil {
			err := peerConnection.SetRemoteDescription(*signalingMessage.Answer)
			if err != nil {
				log.Println("Error setting remote description:", err)
				return
			}
		}
	}
}
