package models

import (
	"context"
	"fmt"
	"log"
	"time"

	"collaboration-service/internal/config"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Room struct {
	ID     primitive.ObjectID `bson:"_id,omitempty"`
	RoomID string             `bson:"room_id"`
	User1  string             `bson:"user1"`
	User2  string             `bson:"user2"`
}

// CreateRoom creates a new room and stores it in MongoDB
func CreateRoom(user1, user2 string) string {
	roomID := generateUniqueRoomID()
	room := Room{
		RoomID: roomID,
		User1:  user1,
		User2:  user2,
	}

	// Get the collection dynamically, ensuring MongoClient is initialized
	collection := config.GetCollection("rooms")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := collection.InsertOne(ctx, room)
	if err != nil {
		log.Fatalf("Failed to insert room into MongoDB: %v", err)
	}

	return roomID
}

// GetRoom retrieves a room from MongoDB by roomID
func GetRoom(roomID string) (*Room, bool) {
	// Get the collection dynamically, ensuring MongoClient is initialized
	collection := config.GetCollection("rooms")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"room_id": roomID}
	var room Room

	err := collection.FindOne(ctx, filter).Decode(&room)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, false
		}
		log.Printf("Error finding room in MongoDB: %v", err)
		return nil, false
	}

	return &room, true
}

var roomCounter = 1

func generateUniqueRoomID() string {
	roomCounter++
	return fmt.Sprintf("room-%d", roomCounter)
}
