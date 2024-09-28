package controllers

import (
	"backend/database"
	"backend/models"

	"context"
	"fmt"
	"log"
	"strconv"
	"strings"

	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var coll *mongo.Collection = database.OpenCollection(database.Client, "question_db", "questions")

func init() {
	addQuestionsToDb()
}

func GetQuestions() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)

		defer cancel()

		fmt.Println(coll)

		// Retrieve documents
		cursor, err := coll.Find(ctx, bson.M{})
		if err != nil {
			fmt.Println("Error in Find: ", err.Error())
			panic(err)
		}

		// Unpack the cursor into slice
		var questions []models.Question
		if err = cursor.All(context.Background(), &questions); err != nil {
			fmt.Println("Error in cursor.All: ", err.Error())
			panic(err)
		}

		c.JSON(http.StatusOK, questions)
	}
}

func GetQuestionsById(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	idsParam := c.Query("id")
	idsString := strings.Split(idsParam, ",")

	if len(idsString) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Need to have at least one question id in params"})
	}

	// Convert string ids to int
	ids := make([]int, len(idsString))

	for i, idstr := range idsString {
		id, err := strconv.Atoi(idstr)

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid question id should be only be integers"})
			return
		}

		ids[i] = id
	}

	var questions []models.Question

	filter := bson.M{"_id": bson.M{"$in": ids}}

	curr, err := coll.Find(ctx, filter)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	curr.All(ctx, &questions)
	c.JSON(http.StatusOK, gin.H{"message": "Questions retrieve successfully", "questions": questions})
}

// Util functions
func addQuestionsToDb() {
	leetCodeQuestions := []interface{}{
		models.Question{
			Title: "Reverse a String",
			Description: `Write a function that 
reverses a string. The 
input string is given as 
an array of characters 
s. 
  
You must do this by 
modifying the input 
array in-place with 
O(1) extra memory. 
  
  
Example 1: 
  
Input: s = 
["h","e","l","l","o"] 
Output: 
["o","l","l","e","h"] 
Example 2: 
  
Input: s = 
["H","a","n","n","a","
 h"] 
Output: 
["h","a","n","n","a","
 H"] 
  
Constraints: 
  
1 <= s.length <= 105 
s[i] is a printable ascii 
character.`,
			Categories: "Strings, Algorithms",
			Complexity: "Easy",
			Link:       "https://leetcode.com/problems/reverse-string/",
		},
		models.Question{
			Title: "Two Sum",
			Description: `
Implement a function 
to detect if a linked 
list contains a cycle.
			`,
			Categories: "Data Structures, Algorithms",
			Complexity: "Easy",
			Link:       "https://leetcode.com/problems/two-sum/",
		},
		models.Question{
			Title: "Roman To Integer",
			Description: `
Given a roman 
numeral, convert it to 
an integer.  
`,
			Categories: "Algorithms",
			Complexity: "Easy",
			Link:       "https://leetcode.com/problems/roman-to-integer/",
		},
	}

	_, err := coll.DeleteMany(context.TODO(), bson.D{})
	if err != nil {
		log.Fatal("Error deleting questions collection: ", err)
	}

	result, err := coll.InsertMany(context.TODO(), leetCodeQuestions)

	if err != nil {
		log.Fatal("Error inserting questions collection: ", err)
	}

	fmt.Printf("Documents inserted: %v\n", len(result.InsertedIDs))
	for _, id := range result.InsertedIDs {
		fmt.Printf("Inserted document with _id: %v\n", id)
	}

}

// func AddQuestionToDb(title, description, categories, complexity, link string) {
// 	question := models.Question{
// 		Title:       title,
// 		Description: description,
// 		Categories:  categories,
// 		Complexity:  complexity,
// 		Link:        link,
// 	}

// 	// Insert the new question into the database
// 	result, err := coll.InsertOne(context.TODO(), question)
// 	if err != nil {
// 		log.Fatal("Error inserting new question into the collection: ", err)
// 	}

// 	fmt.Printf("Document inserted with _id: %v\n", result.InsertedID)
// }

func validateQuestion(question *models.Question) bool {
	return question.Title != "" && question.Description != "" &&
		question.Categories != "" && question.Complexity != "" && question.Link != ""
}

func AddQuestionToDb() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var question models.Question

		if err := c.BindJSON(&question); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
			return
		}

		// Validate required fields
		if !validateQuestion(&question) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields"})
			return
		}

		result, err := coll.InsertOne(ctx, question)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add question to the database"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Question added successfully",
			"_id":     result.InsertedID,
		})
	}
}
