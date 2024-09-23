package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"question-service/handlers"
	"time"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go/v4"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"google.golang.org/api/option"
)

// initFirestore initializes the Firestore client
func initFirestore(ctx context.Context, credentialsPath string) (*firestore.Client, error) {
	opt := option.WithCredentialsFile(credentialsPath)
	app, err := firebase.NewApp(ctx, nil, opt)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize Firebase App: %v", err)
	}

	client, err := app.Firestore(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get Firestore client: %v", err)
	}
	return client, nil
}

func main() {
	// Initialize Firestore client
	ctx := context.Background()
	client, err := initFirestore(ctx, "cs3219-g24-firebase-adminsdk-9cm7h-b1675603ab.json")
	if err != nil {
		log.Fatalf("Failed to initialize Firestore client: %v", err)
	}
	defer client.Close()

	service := &handlers.Service{Client: client}

	// Set up chi router
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Timeout(60 * time.Second))

	// Register routes
	r.Route("/questions", func(r chi.Router) {
		r.Get("/", service.ListQuestions)
		r.Post("/", service.CreateQuestion)

		r.Route("/{id}", func(r chi.Router) {
			r.Get("/", service.ReadQuestion)
			r.Put("/", service.UpdateQuestion)
			r.Delete("/", service.DeleteQuestion)
		})
	})

	// Serve on port 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Start the server
	log.Printf("Starting server on http://localhost:%s", port)
	err = http.ListenAndServe(fmt.Sprintf(":%s", port), r)
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
