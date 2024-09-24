package repository

import (
	"context"
	"time"

	"github.com/CS3219-AY2425S1/cs3219-ay2425s1-project-g32/peerprep-questions/db"
	"github.com/CS3219-AY2425S1/cs3219-ay2425s1-project-g32/peerprep-questions/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type QuestionRepository struct {
	mongoClient *mongo.Client
}

func NewRepository(mongoClient *mongo.Client) QuestionRepository {
	return QuestionRepository{
		mongoClient: mongoClient,
	}
}

func (qr QuestionRepository) CreateQuestion(question model.Question) (*mongo.InsertOneResult, error) {
	collection := db.GetCollection(qr.mongoClient, "questions")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := collection.InsertOne(ctx, question)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (qr QuestionRepository) ListQuestions() ([]model.Question, error) {
	collection := db.GetCollection(qr.mongoClient, "questions")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// // Set up options for pagination
	// opts := options.Find()
	// opts.SetSkip(int64((page - 1) * limit)) // Calculate the number of documents to skip
	// opts.SetLimit(int64(limit))              // Limit the number of documents returned

	// Find the questions with the given filter
	cursor, err := collection.Find(ctx, bson.M{})
	// cursor, err := collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	// Iterate through the cursor and collect results
	var questions []model.Question
	for cursor.Next(ctx) {
		var question model.Question
		if err := cursor.Decode(&question); err != nil {
			return nil, err
		}
		questions = append(questions, question)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return questions, nil
}
