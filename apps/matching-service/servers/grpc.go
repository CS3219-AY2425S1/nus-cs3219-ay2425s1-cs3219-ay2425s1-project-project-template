package servers

import (
	"log"
	pb "matching-service/proto"

	"google.golang.org/grpc"
)

var (
	questionMatchingClient pb.QuestionMatchingServiceClient
)

func InitGrpcServer() *grpc.ClientConn {
	// Dial the server
	conn, err := grpc.Dial("localhost:50051", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("Did not connect: %v", err)
	}

	// Create a new client for the ExampleService
	questionMatchingClient = pb.NewQuestionMatchingServiceClient(conn)

	return conn
}

func GetGrpcClient() pb.QuestionMatchingServiceClient {
	return questionMatchingClient
}
