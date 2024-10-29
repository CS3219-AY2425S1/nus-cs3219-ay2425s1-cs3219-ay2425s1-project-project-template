package controllers

import (
	"backend/database"
	helper "backend/helpers"
	"backend/models"
	"log"

	"context"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"
	"encoding/json"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	// "go.mongodb.org/mongo-driver/mongo"
)

// var database.Coll *mongo.Collection = database.OpenCollection(database.Client, "question_db", "questions")

func GetQuestions(c *gin.Context) {

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)

	defer cancel()

	fmt.Println("database: ", database.Coll)

	// Retrieve documents
	cursor, err := database.Coll.Find(ctx, bson.M{})
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

	if questions == nil {
		questions = []models.Question{}
	}

	c.JSON(http.StatusOK, questions)

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

	// var questions []models.Question

	filter := bson.M{"_id": bson.M{"$in": ids}}

	curr, err := database.Coll.Find(ctx, filter)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var results []map[string]interface{}

	for curr.Next(context.TODO()) {
		var question models.Question
		err := curr.Decode(&question)
		if err != nil {
			return
		}

		// Convert ObjectID to string
		result := map[string]interface{}{
			"ID":          question.ID.Hex(), // Convert ObjectID to string
			"Title":       question.Title,
			"Description": question.Description,
			"Categories":  question.Categories,
			"Complexity":  question.Complexity,
			"Link":        question.Link,
		}

		results = append(results, result)
	}

	// curr.All(ctx, &questions)
	c.JSON(http.StatusOK, gin.H{"message": "Questions retrieve successfully", "questions": results})
}

func AddQuestionToDb() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var QuestionRequest models.QuestionRequest

		if err := c.ShouldBindJSON(&QuestionRequest); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
			return
		}

		var question models.Question = models.Question{
			ID:          primitive.NewObjectID(),
			Title:       QuestionRequest.Title,
			Description: QuestionRequest.Description,
			Categories:  QuestionRequest.Categories,
			Complexity:  QuestionRequest.Complexity,
			Link:        QuestionRequest.Link,
		}

		// Validate required fields
		if !helper.IsQuestionFieldsEmpty(&question) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields"})
			return
		}

		if !helper.IsValidComplexity(&question) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Complexity should be either easy, medium or hard"})
			return
		}

		if !helper.HasDuplicateTitle(&question, database.Coll, ctx) {
			c.JSON(http.StatusConflict, gin.H{"error": "Question with the same title already exists"})
			return
		}

		helper.ParseQuestionForDb(&question)
		// helper.CreateUniqueIdQuestion(&question)

		_, err := database.Coll.InsertOne(ctx, question)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add question to the database"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Question added successfully",
		})
	}
}

func AddLeetCodeQuestionToDb() gin.HandlerFunc {
    return func(c *gin.Context) {
        var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
        defer cancel()

        var LeetCodeAPIRequest models.LeetCodeAPIRequest

        // Bind incoming JSON request
        if err := c.ShouldBindJSON(&LeetCodeAPIRequest); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
            return
        }

        titleSlug := strings.ToLower(strings.ReplaceAll(LeetCodeAPIRequest.Title, " ", "-"))

        // Fetch question from the API
        apiUrl := fmt.Sprintf("http://alfa_leetcode_api:3000/select?titleSlug=%s", titleSlug)
        resp, err := http.Get(apiUrl)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch question from API"})
            return
        }
        defer resp.Body.Close()

        // Define a map to parse the API response
        var apiResponse map[string]interface{}
        if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse API response"})
            return
        }

        // Extract the "question" field from the API response
        questionDescription, ok := apiResponse["question"].(string)
        if !ok {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to extract question description"})
            return
        }

        // Extract and concatenate the categories from "topicTags"
        topicTags, ok := apiResponse["topicTags"].([]interface{})
        if !ok {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to extract topic tags"})
            return
        }

        var categories []string
        for _, tag := range topicTags {
            tagMap, ok := tag.(map[string]interface{})
            if ok {
                if name, found := tagMap["name"].(string); found {
                    categories = append(categories, name)
                }
            }
        }
        categoriesString := strings.Join(categories, ", ")

        // Extract "difficulty" for Complexity
        difficulty, ok := apiResponse["difficulty"].(string)
        if !ok {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to extract difficulty"})
            return
        }

        // Extract the link
        link, ok := apiResponse["link"].(string)
        if !ok {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to extract question link"})
            return
        }

        // Create the question object
        question := models.Question{
            ID:          primitive.NewObjectID(),
            Title:       LeetCodeAPIRequest.Title,
            Description: questionDescription,
            Categories:  categoriesString,
            Complexity:  difficulty,
            Link:        link,
        }

        // Check for duplicate title
        if !helper.HasDuplicateTitle(&question, database.Coll, ctx) {
			c.JSON(http.StatusConflict, gin.H{"error": "Question with the same title already exists"})
			return
		}

        // Parse question before inserting into the database
        helper.ParseQuestionForDb(&question)

        // Insert the question into the database
        _, err = database.Coll.InsertOne(ctx, question)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add question to the database"})
            return
        }

        c.JSON(http.StatusOK, gin.H{"message": "Question added successfully", "question": question})
    }
}

func UpdateQuestion(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	var updatedQuestion models.Question
	if err := c.ShouldBindJSON(&updatedQuestion); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request body"})
		return
	}

	log.Printf("Updated Question: %+v\n", updatedQuestion)

	filter := bson.M{"_id": updatedQuestion.ID}
	update := bson.M{
		"$set": bson.M{
			"title":       updatedQuestion.Title,
			"description": updatedQuestion.Description,
			"categories":  updatedQuestion.Categories,
			"complexity":  updatedQuestion.Complexity,
			"link":        updatedQuestion.Link,
		},
	}

	result, err := database.Coll.UpdateOne(ctx, filter, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error updating question", "error": err.Error()})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Question not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Question updated successfully"})
}

func GetTopics(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	// Perform a distinct query to get unique categories
	topics, err := database.Coll.Distinct(ctx, "categories", bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch topics", "details": err.Error()})
		return
	}

	// Check if topics list is empty
	if len(topics) == 0 {
		c.JSON(http.StatusOK, gin.H{"message": "No topics found", "topics": []string{}})
		return
	}

	// Create a set to hold unique individual topics
	topicSet := make(map[string]struct{})
	for _, topic := range topics {
		if str, ok := topic.(string); ok {
			// Split by commas and trim each topic, then add to the set
			for _, individualTopic := range strings.Split(str, ",") {
				trimmedTopic := strings.TrimSpace(individualTopic)
				if trimmedTopic != "" {
					topicSet[trimmedTopic] = struct{}{}
				}
			}
		}
	}

	// Convert the set to a slice for JSON response
	var stringTopics []string
	for topic := range topicSet {
		stringTopics = append(stringTopics, topic)
	}

	c.JSON(http.StatusOK, gin.H{"message": "Topics retrieved successfully", "topics": stringTopics})
}

func DeleteQuestion(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	// var jsonBody map[string]string
	// if err := c.ShouldBindJSON(&jsonBody); err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request body"})
	// 	return
	// }

	id := c.Query("id")

	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request body"})
		return
	}

	// id, exists := jsonBody["_id"]
	// if !exists {
	// 	c.JSON(http.StatusBadRequest, gin.H{"message": "Missing '_id' field in request body"})
	// 	return
	// }

	objectId, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid question id"})
		return
	}

	filter := bson.M{"_id": objectId}
	result, err := database.Coll.DeleteOne(ctx, filter)

	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Question not found"})
		return
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error deleting question", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Question deleted successfully"})
}