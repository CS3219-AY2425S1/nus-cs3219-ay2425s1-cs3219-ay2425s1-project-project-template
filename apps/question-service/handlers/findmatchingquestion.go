package handlers

import (
	"context"
	pb "proto/questionmatching"
)

func (s *GrpcServer) FindMatchingQuestion(ctx context.Context, req *pb.MatchQuestionRequest) (*pb.QuestionFound, error) {
	// STUB
	return &pb.QuestionFound{
		QuestionId:         1,
		QuestionName:       "abc",
		QuestionDifficulty: "Easy",
		QuestionTopics:     []string{"Algorithms", "Arrays"},
	}, nil
}
