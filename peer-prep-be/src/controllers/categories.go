package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/CS3219-AY2425S1/cs3219-ay2425s1-project-g01/peer-prep-be/src/configs"
	"github.com/CS3219-AY2425S1/cs3219-ay2425s1-project-g01/peer-prep-be/src/models"
	"github.com/CS3219-AY2425S1/cs3219-ay2425s1-project-g01/peer-prep-be/src/responses"
	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var categoriesCollection *mongo.Collection = configs.GetCollection(configs.DB, "categories")

func GetCategories(c echo.Context) error {

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := categoriesCollection.Find(ctx, bson.M{})

	if err != nil {
		return c.JSON(http.StatusInternalServerError, responses.StatusResponse{
			Message: err.Error(),
		})
	}

	var categories []models.Category
	if err = cursor.All(ctx, &categories); err != nil {
		return c.JSON(http.StatusInternalServerError, responses.StatusResponse{
			Message: err.Error(),
		})
	}

	return c.JSON(http.StatusOK, responses.StatusResponse{
		Message: "Success",
		Data:    &echo.Map{"categories": categories},
	})
}

func CreateCategory(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	// var existingCategory models.Category
	var category models.Category
	defer cancel()

	if err := c.Bind(&category); err != nil {
		return c.JSON(http.StatusBadRequest, responses.StatusResponse{
			Message: err.Error(),
		})
	}

	// Validate Category Name
	if validationErr := validate.Struct(&category); validationErr != nil {
		return c.JSON(http.StatusBadRequest, responses.StatusResponse{
			Status:  http.StatusBadRequest,
			Message: errMessage,
			Data:    &echo.Map{"data": validationErr.Error()},
		})
	}

	// Duplicate handling
	// err := categoriesCollection.FindOne(ctx, bson.M{"categoryName": category.CategoryName}).Decode(&existingCategory)
	// if err == nil {
	// 	return c.JSON(http.StatusBadRequest, responses.StatusResponse{Message: "Category already exists"})
	// }

	newCategory := models.Category{
		Category_id:   primitive.NewObjectID(),
		Category_name: category.Category_name,
	}

	// Insert new if it does not exist, case insensitive
	_, err := categoriesCollection.UpdateOne(ctx,
		bson.M{"category_name": newCategory.Category_name}, // Filter by category_name only, not the obj
		bson.M{"$setOnInsert": bson.M{
			"category_id":   newCategory.Category_id,
			"category_name": newCategory.Category_name,
		}},
		options.Update().SetUpsert(true).SetCollation(&options.Collation{
			Locale:   "en",
			Strength: 2, // Case-insensitive comparison
		}),
	)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, responses.StatusResponse{
			Message: err.Error(),
		})
	}

	return c.JSON(http.StatusCreated, responses.StatusResponse{
		Message: "Category created successfully",
	})
}

// Updates a category, e.g. singular -> plural
func UpdateCategory(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	categoryId := c.Param("categoryId")
	_, err := primitive.ObjectIDFromHex(categoryId)
	if err != nil {
		return c.JSON(http.StatusBadRequest, responses.StatusResponse{
			Message: "Invalid category ID: " + err.Error(),
		})
	}

	var category models.Category
	if err := c.Bind(&category); err != nil {
		return c.JSON(http.StatusBadRequest, responses.StatusResponse{
			Message: err.Error(),
		})
	}

	update := bson.M{
		"$set": bson.M{
			"category_name": category.Category_name,
		},
	}

	// Perform the Update operation
	_, err = categoriesCollection.UpdateOne(ctx, bson.M{"_id": categoryId}, update)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, responses.StatusResponse{
			Message: err.Error(),
		})
	}

	return c.JSON(http.StatusOK, responses.StatusResponse{
		Message: "Category updated successfully",
	})
}

func DeleteCategory(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	categoryId := c.Param("categoryId")
	_, err := primitive.ObjectIDFromHex(categoryId)
	if err != nil {
		return c.JSON(http.StatusBadRequest, responses.StatusResponse{
			Message: "Invalid category ID: " + err.Error(),
		})
	}

	_, err = categoriesCollection.DeleteOne(ctx, bson.M{"_id": categoryId})

	if err != nil {
		return c.JSON(http.StatusInternalServerError, responses.StatusResponse{
			Message: err.Error(),
		})
	}

	return c.JSON(http.StatusOK, responses.StatusResponse{
		Message: "Category deleted successfully",
	})
}
