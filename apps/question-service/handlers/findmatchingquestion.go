package handlers

import (
	"context"
	"log"
	"math/rand"
	pb "proto/questionmatching"
	"question-service/models"

	"cloud.google.com/go/firestore"
)

func (s *GrpcServer) FindMatchingQuestion(ctx context.Context, req *pb.MatchQuestionRequest) (*pb.QuestionFound, error) {
	log.Printf("Received matching question request: %v", req)

	var question *models.Question

	// Match by both topic and difficulty

	// Match by just topic

	// Match by difficulty

	// No matches, so return random question
	if question == nil {
		randomQuestion, err := retrieveRandomQuestion(s.Client, ctx)
		if err != nil {
			return nil, err
		}
		question = randomQuestion
	}

	return &pb.QuestionFound{
		QuestionId:         question.ID,
		QuestionName:       question.Title,
		QuestionDifficulty: question.Complexity.String(),
		QuestionTopics:     question.Categories,
	}, nil
}

func retrieveRandomQuestion(client *firestore.Client, ctx context.Context) (*models.Question, error) {
	// Count documents
	docs, err := client.Collection("questions").Documents(ctx).GetAll()
	if err != nil || len(docs) == 0 {
		log.Fatalf("No documents found: %v", err)
	}

	// Generate a random offset
	randomOffset := rand.Intn(len(docs))

	// Retrieve the document at the random offset
	doc := docs[randomOffset]
	var question models.Question
	if err := doc.DataTo(&question); err != nil {
		return nil, err

	}
	question.DocRefID = doc.Ref.ID

	return &question, nil
}
