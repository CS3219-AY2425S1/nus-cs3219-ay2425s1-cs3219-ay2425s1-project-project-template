package handlers

import (
	"context"
	"log"
	pb "proto/questionmatching"
)

func (s *GrpcServer) FindMatchingQuestion(ctx context.Context, req *pb.MatchQuestionRequest) (*pb.QuestionFound, error) {
	log.Printf("Received matching question request: %v", req)
	return &pb.QuestionFound{
		QuestionId:         1,
		QuestionName:       "abc",
		QuestionDifficulty: "Easy",
		QuestionTopics:     []string{"Algorithms", "Arrays"},
	}, nil
}
