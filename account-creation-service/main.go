package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
	"github.com/joho/godotenv"
)

type User struct {
	Email     string `json:"email" bson:"email"`
	Name  string `json:"name" bson:"name"`
	Password  string `json:"password" bson:"password"`
	CreatedAt time.Time `bson:"createdDate"`
	Type string `bson:"accountType"`
}

var userCollection *mongo.Collection

func connectDB() *mongo.Client {
	// Load env variables
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	// get MongoDB URI
	mongoURI := os.Getenv("MONGODB_URI")

	// Client to the mongodb atlas
	clientOptions := options.Client().
		ApplyURI(mongoURI)

	// Connect to MongoDB
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatalf("MongoDB connection error: %v", err)
	}

	fmt.Println("MongoDB connected")
	return client
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func registerUser(c *gin.Context) {
	var user User

	// If JSON request does not fit into our User struct, status error
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// If any fields are empty, status error
	if user.Email == "" || user.Name == "" || user.Password == "" {
		log.Printf("Error inserting user into database: %v", user.Type)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email, username, password and type is required"})
		return
	}

	// Check if email is unique
	var existingUser User
	err := userCollection.FindOne(context.TODO(), bson.M{"email": user.Email}).Decode(&existingUser)
	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email already exists"})
		return
	}

	// Hash the password
	hashedPassword, err := hashPassword(user.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error hashing password"})
		return
	}

	user.Password = hashedPassword
	user.CreatedAt = time.Now()
	user.Type = "User"

	// Insert new account into MongoDB
	_, err = userCollection.InsertOne(context.TODO(), user)
	if err != nil {
		log.Printf("Error inserting user into database: %v", err) // Log the error
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error inserting user into database"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
}

func main() {
	client := connectDB()
	defer client.Disconnect(context.TODO())
	userCollection = client.Database("Database1").Collection("user_account")
	r := gin.Default()
	r.POST("/register", registerUser)
	port := os.Getenv("PORT")
	r.Run(":" + port) 
}
