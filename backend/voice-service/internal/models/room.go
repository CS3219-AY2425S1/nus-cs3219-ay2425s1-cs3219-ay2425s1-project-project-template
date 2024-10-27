package models

import (
	"context"
	"log"
	"time"

	"voice-service/internal/config"

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

// GetRoom retrieves a room from MongoDB by roomID
func GetRoom(roomID string) (*Room, bool) {
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
