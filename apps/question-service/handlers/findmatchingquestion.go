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

	var docs []*firestore.DocumentSnapshot

	// 1. Match by both topic and difficulty
	if len(docs) == 0 {
		d, err := queryTopicAndDifficultyQuestion(s.Client, ctx, req.MatchedTopics)
		if err != nil {
			return nil, err
		}
		docs = d
	}

	// 2. Match by just topic
	if len(docs) == 0 {
		d, err := queryTopicQuestion(s.Client, ctx, req.MatchedTopics)
		if err != nil {
			return nil, err
		}
		docs = d
	}

	// 3. Match by difficulty
	if len(docs) == 0 {
		d, err := queryDifficultyQuestion(s.Client, ctx)
		if err != nil {
			return nil, err
		}
		docs = d
	}

	// 4. No matches, so return random question
	if len(docs) == 0 {
		d, err := queryAllQuestions(s.Client, ctx)
		if err != nil {
			return nil, err
		}
		docs = d
	}

	// 5a. No matches, return error
	if len(docs) == 0 {
		return nil, errors.New("No questions found")
	}

	// 5b. Retrieve random question from potential questions
	// Generate a random offset
	randomOffset := rand.Intn(len(docs))

	// Retrieve the document at the random offset
	doc := docs[randomOffset]
	var question models.Question
	if err := doc.DataTo(&question); err != nil {
		return nil, err

	}
	question.DocRefID = doc.Ref.ID

	return &pb.QuestionFound{
		QuestionId:         question.ID,
		QuestionName:       question.Title,
		QuestionDifficulty: question.Complexity.String(),
		QuestionTopics:     question.Categories,
	}, nil
}

func queryTopicAndDifficultyQuestion(client *firestore.Client, ctx context.Context, topics []string, difficulties []string) ([]*firestore.DocumentSnapshot, error) {
	return client.Collection("questions").Where("categories", "in", topics).Documents(ctx).GetAll()
}

func queryTopicQuestion(client *firestore.Client, ctx context.Context, topics []string) ([]*firestore.DocumentSnapshot, error) {
	return client.Collection("questions").Where("categories", "array-contains-any", topics).Documents(ctx).GetAll()
}

func queryDifficultyQuestion(client *firestore.Client, ctx context.Context, difficulties []string) ([]*firestore.DocumentSnapshot, error) {
	return client.Collection("questions").Where("categories", "in", difficulties).Documents(ctx).GetAll()

}

func queryAllQuestions(client *firestore.Client, ctx context.Context) ([]*firestore.DocumentSnapshot, error) {
	return client.Collection("questions").Documents(ctx).GetAll()
}
