package handlers

import (
	"context"
	"errors"
	"log"
	"math/rand"
	pb "proto/questionmatching"
	"question-service/models"

	"cloud.google.com/go/firestore"
)

func (s *GrpcServer) FindMatchingQuestion(ctx context.Context, req *pb.MatchQuestionRequest) (*pb.QuestionFound, error) {
	log.Printf("Received matching question request: %v", req)

	var question *models.Question

	// 1. Match by both topic and difficulty
	if question == nil {
		difficultyQuestion, err := queryTopicAndDifficultyQuestion(s.Client, ctx)
		if err != nil {
			return nil, err
		}
		question = difficultyQuestion
	}

	// 2. Match by just topic
	if question == nil {
		difficultyQuestion, err := queryTopicQuestion(s.Client, ctx)
		if err != nil {
			return nil, err
		}
		question = difficultyQuestion
	}

	// 3. Match by difficulty
	if question == nil {
		difficultyQuestion, err := queryDifficultyQuestion(s.Client, ctx)
		if err != nil {
			return nil, err
		}
		question = difficultyQuestion
	}

	// 4. No matches, so return random question
	if question == nil {
		randomQuestion, err := queryRandomQuestion(s.Client, ctx)
		if err != nil {
			return nil, err
		}
		question = randomQuestion
	}

	// 5. No matches, return error
	if question == nil {
		return nil, errors.New("No questions found")
	}

	return &pb.QuestionFound{
		QuestionId:         question.ID,
		QuestionName:       question.Title,
		QuestionDifficulty: question.Complexity.String(),
		QuestionTopics:     question.Categories,
	}, nil
}

func queryTopicAndDifficultyQuestion(client *firestore.Client, ctx context.Context) (*models.Question, error) {
	return nil, nil
}

func queryTopicQuestion(client *firestore.Client, ctx context.Context) (*models.Question, error) {
	return nil, nil
}

func queryDifficultyQuestion(client *firestore.Client, ctx context.Context) (*models.Question, error) {
	return nil, nil
}

func queryRandomQuestion(client *firestore.Client, ctx context.Context) (*models.Question, error) {
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
