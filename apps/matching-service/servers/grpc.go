package servers

import (
	"log"
	pb "matching-service/proto"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

var (
	questionMatchingClient pb.QuestionMatchingServiceClient
)

func InitGrpcServer() *grpc.ClientConn {
	// Dial the server
	conn, err := grpc.NewClient("localhost:50051", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("Did not connect: %v", err)
	} else {
		log.Println("Connected to Grpc server at :50051")
	}

	// Create a new client for the ExampleService
	questionMatchingClient = pb.NewQuestionMatchingServiceClient(conn)

	return conn
}

func GetGrpcClient() pb.QuestionMatchingServiceClient {
	return questionMatchingClient
}
