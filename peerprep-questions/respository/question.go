package repository

import (
	"context"
	"time"

	"github.com/CS3219-AY2425S1/cs3219-ay2425s1-project-g32/peerprep-questions/db"
	"github.com/CS3219-AY2425S1/cs3219-ay2425s1-project-g32/peerprep-questions/model"
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
