package config

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var MongoClient *mongo.Client
var dbName string

// ConnectDB initializes the MongoDB connection using environment variables
func ConnectDB() {
	log.Println("### Loading .env file ###")
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
	log.Println("### .env file loaded successfully ###")

	// Get MongoDB URI and DB Name from environment variables
	mongoURI := os.Getenv("MONGO_URI_CS")
	dbName = os.Getenv("MONGO_DBNAME")
	if mongoURI == "" || dbName == "" {
		log.Fatalf("MONGO_URI_CS or MONGO_DBNAME is not set in the environment")
	}

	// Set MongoDB client options
	log.Printf("### Connecting to MongoDB at URI: %s, using database: %s ###", mongoURI, dbName)
	clientOptions := options.Client().ApplyURI(mongoURI)

	// Create a context with a timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Use mongo.Connect to connect to the database
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}

	// Ping the database to ensure the connection is established
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatalf("Failed to ping MongoDB: %v", err)
	}

	// Set the global MongoClient variable
	MongoClient = client

	log.Println("### Successfully connected to MongoDB ###")
}

func GetCollection(collectionName string) *mongo.Collection {
	if MongoClient == nil {
		log.Fatalf("MongoClient is not initialized when accessing collection: %s", collectionName)
	}
	log.Printf("Successfully accessed collection: %s", collectionName)
	return MongoClient.Database(dbName).Collection(collectionName)
}
