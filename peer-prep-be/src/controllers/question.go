package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/CS3219-AY2425S1/cs3219-ay2425s1-project-g01/peer-prep-be/src/configs"
	"github.com/CS3219-AY2425S1/cs3219-ay2425s1-project-g01/peer-prep-be/src/models"
	"github.com/CS3219-AY2425S1/cs3219-ay2425s1-project-g01/peer-prep-be/src/responses"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var questionCollection *mongo.Collection = configs.GetCollection(configs.DB, "questions")
var validate = validator.New()

func CreateQuestion(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var question models.Question
	defer cancel()

	// Validate the request body
	if err := c.Bind(&question); err != nil {
		return c.JSON(http.StatusBadRequest, responses.StatusResponse{Status: http.StatusBadRequest, Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	// Validate fields that are indicated as "Required" in model
	if validationErr := validate.Struct(&question); validationErr != nil {
		return c.JSON(http.StatusBadRequest, responses.StatusResponse{Status: http.StatusBadRequest, Message: "error", Data: &echo.Map{"data": validationErr.Error()}})
	}

	newQuestion := models.Question{
		Question_id: primitive.NewObjectID(),
		Question_title: question.Question_title,
		Question_description: question.Question_description,
		Question_categories: question.Question_categories,
		Question_complexity: question.Question_complexity,
	}

	result, err := questionCollection.InsertOne(ctx, newQuestion)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, responses.StatusResponse{Status: http.StatusInternalServerError, Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	return c.JSON(http.StatusCreated, responses.StatusResponse{Status: http.StatusCreated, Message: "success", Data: &echo.Map{"data": result}})
}

func GetQuestion(c echo.Context) error {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    questionId := c.Param("questionId") // URL param from GET route
    var question models.Question
    defer cancel()

    objId, _ := primitive.ObjectIDFromHex(questionId) // Convert to ObjectID (how MongoDB stores Ids)

    err := questionCollection.FindOne(ctx, bson.M{"question_id": objId}).Decode(&question)

    if err != nil {
        return c.JSON(http.StatusInternalServerError, responses.StatusResponse{Status: http.StatusInternalServerError, Message: "error", Data: &echo.Map{"data": err.Error()}})
    }

    return c.JSON(http.StatusOK, responses.StatusResponse{Status: http.StatusOK, Message: "success", Data: &echo.Map{"data": question}})
}

func GetQuestions(c echo.Context) error {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var questions []models.Question
	defer cancel()

	cur, err := questionCollection.Find(ctx, bson.D{{}}, options.Find())

	for cur.Next(ctx) {
		var doc models.Question
		err := cur.Decode(&doc)

		if err != nil {
			return c.JSON(http.StatusInternalServerError, responses.StatusResponse{Status: http.StatusInternalServerError, Message: "error", Data: &echo.Map{"data": err.Error()}})
		}
		questions = append(questions, doc)
	}

    if err != nil {
        return c.JSON(http.StatusInternalServerError, responses.StatusResponse{Status: http.StatusInternalServerError, Message: "error", Data: &echo.Map{"data": err.Error()}})
    }

    return c.JSON(http.StatusOK, responses.StatusResponse{Status: http.StatusOK, Message: "success", Data: &echo.Map{"data": questions}})
}

