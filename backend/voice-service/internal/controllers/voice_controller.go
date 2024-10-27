package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"voice-service/internal/models"
)

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
