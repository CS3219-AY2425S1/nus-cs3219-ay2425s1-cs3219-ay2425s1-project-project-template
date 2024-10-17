package services

import (
	"context"
	"log"
	"matching-service/internal/models"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var MongoClient *mongo.Client
var MatchingCollection *mongo.Collection

// ConnectToMongo initializes the MongoDB connection and collection
func ConnectToMongo() {
	// Load environment variables from .env file
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// Get MongoDB URI and database name from environment variables
	mongoURI := os.Getenv("MONGO_URI_MS")
	dbName := os.Getenv("MONGO_DBNAME")

	if mongoURI == "" || dbName == "" {
		log.Fatalf("MongoDB URI or DB name not set in .env file")
	}

	// Set MongoDB client options
	clientOptions := options.Client().ApplyURI(mongoURI)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Connect to MongoDB
	MongoClient, err = mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}

	// Ping MongoDB to verify connection
	err = MongoClient.Ping(ctx, nil)
	if err != nil {
		log.Fatalf("Error pinging MongoDB: %v", err)
	}

	// Initialize the collection
	MatchingCollection = MongoClient.Database(dbName).Collection("matching")
	log.Printf("Connected to database: %s, collection: %s", dbName, MatchingCollection.Name())
	log.Println("Connected to MongoDB")
}

// InsertMatching inserts a matching entry into the MongoDB collection
func InsertMatching(matchingInfo models.MatchingInfo) (*models.MatchingInfo, error) {
	log.Printf("Inserting document: %+v", matchingInfo)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Insert the matchingInfo into the MongoDB collection
	result, err := MatchingCollection.InsertOne(ctx, matchingInfo)
	if err != nil {
		log.Printf("Error inserting matching info: %v", err)
		return nil, err
	}

	log.Printf("MongoDB Insert Result: %+v", result)
	log.Printf("Inserted matching info for user_id: %s", matchingInfo.UserID)
	return &matchingInfo, nil
}

// FindMatch finds a pending match for a user based on difficulty and topics
func FindMatch(matchingInfo models.MatchingInfo) (*models.MatchingInfo, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Create queries for difficulty levels and topics
	filter := bson.M{
		"status": models.Pending,
		"user_id": bson.M{
			"$ne": matchingInfo.UserID,
		},
		"difficulty_levels": bson.M{
			"$in": matchingInfo.DifficultyLevel,
		},
		"categories": bson.M{
			"$in": matchingInfo.Categories,
		},
	}

	// Try to find a matching user
	var potentialMatch models.MatchingInfo
	err := MatchingCollection.FindOne(ctx, filter).Decode(&potentialMatch)
	if err != nil {
		log.Printf("No matching user found for user_id: %s", matchingInfo.UserID)
		return nil, nil
	}

	// Mark the potential match as matched
	_, err = MatchingCollection.UpdateOne(ctx, bson.M{"user_id": potentialMatch.UserID}, bson.M{
		"$set": bson.M{"status": models.Matched},
	})

	if err != nil {
		log.Printf("Error updating match status for user_id %s: %v", potentialMatch.UserID, err)
		return nil, err
	}

	log.Printf("Found match for user_id: %s", matchingInfo.UserID)
	return &potentialMatch, nil
}

// MarkAsTimeout updates the user's match status to Timeout after a 30-second timeout
func MarkAsTimeout(matchingInfo models.MatchingInfo) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Update the user's status to Timeout in MongoDB
	_, err := MatchingCollection.UpdateOne(ctx, bson.M{
		"user_id": matchingInfo.UserID,
		"status":  models.Pending,
	}, bson.M{
		"$set": bson.M{"status": models.Timeout},
	})

	if err != nil {
		log.Printf("Error marking user_id %s as Timeout: %v", matchingInfo.UserID, err)
		return err
	}

	log.Printf("User %s has been marked as Timeout", matchingInfo.UserID)
	return nil
}

// UpdateMatchStatusAndRoomID updates the status and room_id of a user in MongoDB
func UpdateMatchStatusAndRoomID(userID string, status string, roomID string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{"user_id": userID}
	update := bson.M{
		"$set": bson.M{
			"status":  status,
			"room_id": roomID, // Update the room_id for the user
		},
	}

	_, err := MatchingCollection.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Printf("Error updating match status and room_id for user_id %s: %v", userID, err)
		return err
	}

	log.Printf("Updated user_id %s status to %s and room_id to %s", userID, status, roomID)
	return nil
}
