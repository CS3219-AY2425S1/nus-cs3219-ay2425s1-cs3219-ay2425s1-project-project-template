package controllers

import (
	"backend/database"
	"backend/models"

	"context"
	"fmt"
	"log"

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

// Util functions
func addQuestionsToDb() {
	leetCodeQuestions := []interface{}{
		models.Question{
			ID:    1,
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
			Complexity: "hard",
			Link:       "https://leetcode.com/problems/reverse-string/",
		},
		models.Question{
			ID:          2,
			Title:       "Two Sum",
			Description: "Given an array of integers",
			Categories:  "Arrays, Algorithms",
			Complexity:  "easy",
			Link:        "https://leetcode.com/problems/two-sum/",
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
