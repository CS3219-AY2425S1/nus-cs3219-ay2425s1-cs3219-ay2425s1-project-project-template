// this is the main file to run the server
package main

import (
	"os"
	"github.com/sirupsen/logrus"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	"fmt"
	"time"
)

// for initial API testing
/*
var questions = []Question{
	{
		ID:          1,
		Difficulty:  Medium,
		Title:       "Two Sum",
		Description: "Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
		TestCases: map[string]string{
			"[2, 7, 11, 15], 9": "[0, 1]",
			"[3, 2, 4], 6":      "[1, 2]",
			"[3, 3], 6":         "[0, 1]",
		},
	},
	{
		ID:          2,
		Difficulty:  Easy,
		Title:       "Reverse Integer",
		Description: "Given a 32-bit signed integer, reverse digits of an integer.",
		TestCases: map[string]string{
			"123": "321",
			"1":   "1",
			"22":  "22",
		},
	},
	{
		ID:          3,
		Difficulty:  Hard,
		Title:       "Median of Two Sorted Arrays",
		Description: "There are two sorted arrays nums1 and nums2 of size m and n respectively. Find the median of the two sorted arrays.",
		TestCases: map[string]string{
			"[1, 3], [2]":    "2.0",
			"[1, 2], [3, 4]": "2.5",
			"[0, 0], [0, 0]": "0.0",
		},
	},
}
*/
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


	router := gin.Default()
	//initialise the database and handle errors
	server, err := initialiseDB()

	if err != nil {
		panic(err)
	}

	//create a new instance of the questionDB
	questionDB := NewQuestionDB(server)

	//set all the endpoints
	SetAllEndpoints(router, questionDB, logger)

	logger.Log.Info(fmt.Sprintf("Server started at time: %s", time.Now().String()))

	router.Run(":9090") //currently local hosted
}
