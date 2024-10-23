package controllers

import (
	"collaboration-service/internal/models"
	"encoding/json"
	"log"
	"net/http"
)

// CreateRoomHandler handles the HTTP request to create a new room
func CreateRoomHandler(w http.ResponseWriter, r *http.Request) {
	user1 := r.URL.Query().Get("user1")
	user2 := r.URL.Query().Get("user2")

	if user1 == "" || user2 == "" {
		http.Error(w, "Missing user1 or user2", http.StatusBadRequest)
		return
	}

	roomID := models.CreateRoom(user1, user2)
	log.Printf("Room created with ID: %s for users: %s and %s", roomID, user1, user2)

	response := map[string]string{
		"message": "Room created",
		"roomID":  roomID,
	}
	json.NewEncoder(w).Encode(response)
}

// StartP2PServiceHandler handles the API call to start P2P voice chat for a room
func StartP2PServiceHandler(w http.ResponseWriter, r *http.Request) {
	roomID := r.URL.Query().Get("roomID")

	if roomID == "" {
		http.Error(w, "Missing roomID", http.StatusBadRequest)
		return
	}

	room, exists := models.GetRoom(roomID)
	if !exists {
		http.Error(w, "Room not found", http.StatusNotFound)
		return
	}

	log.Printf("Starting P2P service for room %s between %s and %s", room.RoomID, room.User1, room.User2)

	response := map[string]string{
		"message": "P2P voice chat service started",
		"roomID":  room.RoomID,
	}
	json.NewEncoder(w).Encode(response)
}
