package main

import (
	"context"
	"log"
	"net"
	pb "proto/questionmatching"

	"google.golang.org/grpc"
)

type server struct {
	pb.UnimplementedQuestionMatchingServiceServer // Embed the unimplemented service
}

func initGrpcServer() {
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterQuestionMatchingServiceServer(s, &server{})

	log.Printf("gRPC Server is listening on port 50051...")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}

func (s *server) FindMatchingQuestion(ctx context.Context, req *pb.MatchQuestionRequest) (*pb.QuestionFound, error) {
	return &pb.QuestionFound{
		QuestionId:         1,
		QuestionName:       "abc",
		QuestionDifficulty: "Easy",
		QuestionTopics:     []string{"Algorithms", "Arrays"},
	}, nil
}
