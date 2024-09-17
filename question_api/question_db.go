package main

import (
	"context"
	"go.mongodb.org/mongo-driver/mongo"
	"github.com/joho/godotenv"
	"log"
	"os"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func initialiseDB() (*mongo.Client, error) {
	// Load environment variables
	err := godotenv.Load("../questionDB.env")
	
	if err != nil {
		log.Fatal("Error loading environment variables: " + err.Error())
	}

	mongoURI := os.Getenv("MONGODB_URI")
	
	if mongoURI == "" {
		log.Fatal("MONGODB_URI not set in environment variables")
	}

	clientOptions := options.Client().ApplyURI(mongoURI)

	// Connect to MongoDB
	server, err := mongo.Connect(context.Background(), clientOptions)

	if err != nil {
		log.Fatal("Error connecting to MongoDB" + err.Error())
	}

	// Check the connection
	err = server.Ping(context.Background(), nil)

	if err != nil {
		return nil, err
	}

	return server, nil
}