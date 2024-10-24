package main

import (
	"context"
	"log"
	"net"
	pb "proto/questionmatching"

	"google.golang.org/grpc"
)

type server struct {
	pb.UnimplementedQuestionServiceServer // Embed the unimplemented service
}

func (s *server) FindMatchingQuestion(ctx context.Context, req *pb.MatchQuestionRequest) (*pb.QuestionFound, error) {
	return &pb.QuestionFound{
		QuestionId:         1,
		QuestionName:       "abc",
		QuestionDifficulty: "Easy",
		QuestionTopics:     []string{"Algorithms", "Arrays"},
	}, nil
}

func initgRPCServer() {
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	grpc.NewServer(s, &server{})

	log.Printf("Server is listening on port 50051...")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
