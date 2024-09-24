// this is the main file to run the server
package main

import (
	"fmt"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/mongo"
)

// QuestionDB is a struct that contains a pointer to a mongo client.
// questions is the collection with all the questions, nextId is a single-entry collection that stores the next ID to be used.
type QuestionDB struct {
	questions *mongo.Collection
	nextId 	  *mongo.Collection
}

// returns a pointer to an instance of the Question collection
func NewQuestionDB(client *mongo.Client) *QuestionDB {

	questionCollection := client.Database("questions").Collection("questions")
	idCollection := client.Database("questions").Collection("id")
	return &QuestionDB{questions: questionCollection, nextId: idCollection}
}

// Logger is a struct that contains a pointer to a logrus logger.
type Logger struct {
	Log *logrus.Logger
}

func NewLogger(logger *logrus.Logger) *Logger {
	return &Logger{Log: logger}
}

func main() {
	//initialise logger file and directory if they do not exist
	logger := NewLogger(logrus.New())

	logDirectory := "./log"
	
	if err := os.MkdirAll(logDirectory, 0755); err != nil {
		logger.Log.Error("Failed to create log directory: " + err.Error())
	}

	logFile, err := os.OpenFile("./log/question_api.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)

	if err != nil {
		logger.Log.Warn("Failed to log to file, using default stderr")
	}

	defer logFile.Close()

	logger.Log.Out = logFile

	//initialise the database and handle errors
	server, err := initialiseDB()

	if err != nil {
		panic(err)
	}

	//create a new instance of the questionDB
	questionDB := NewQuestionDB(server)

	
	router := gin.Default()
	SetCors(router)
	SetAllEndpoints(router, questionDB, logger)

	logger.Log.Info(fmt.Sprintf("Server started at time: %s", time.Now().String()))

	router.Run(":9090") 
}
