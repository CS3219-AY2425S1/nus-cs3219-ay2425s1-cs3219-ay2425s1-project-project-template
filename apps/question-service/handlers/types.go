package handlers

import (
	pb "proto/questionmatching"

	"cloud.google.com/go/firestore"
)

type Service struct {
	Client *firestore.Client
}

type GrpcServer struct {
	pb.UnimplementedQuestionMatchingServiceServer // Embed the unimplemented service
}
