package main

import (
	"cloud.google.com/go/firestore"
	"context"
	firebase "firebase.google.com/go/v4"
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	"google.golang.org/api/option"
	"history-service/handlers"
	"log"
	"net/http"
	"os"
	"time"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	//ctx := context.Background()
	//client, err := initFirestore(ctx)
	//if err != nil {
	//	log.Fatalf("Failed to initialize Firestore client: %v", err)
	//}
	//defer client.Close()

	// Initialize Firestore client
	ctx := context.Background()
	client, err := initFirestore(ctx)
	if err != nil {
		log.Fatalf("Failed to initialize Firestore client: %v", err)
	}
	defer client.Close()

	service := &handlers.Service{Client: client}

	r := initChiRouter(service)
	initRestServer(r)
}

func initFirestore(ctx context.Context) (*firestore.Client, error) {
	credentialsPath := os.Getenv("FIREBASE_CREDENTIAL_PATH")
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

func initChiRouter(service *handlers.Service) *chi.Mux {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Timeout(60 * time.Second))

	r.Use(cors.Handler(cors.Options{
		// AllowedOrigins: []string{"http://localhost:3000"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"https://*", "http://*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	registerRoutes(r, service)

	return r
}

func registerRoutes(r *chi.Mux, service *handlers.Service) {
	r.Route("/histories", func(r chi.Router) {
		r.Post("/", service.CreateHistory)

		r.Route("/{docRefId}", func(r chi.Router) {
			r.Get("/", service.ReadHistory)
			r.Put("/", service.UpdateHistory)
			r.Delete("/", service.DeleteHistory)
		})
	})
}

func initRestServer(r *chi.Mux) {
	// Serve on port 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Start the server
	log.Printf("Starting REST server on http://localhost:%s", port)
	err := http.ListenAndServe(fmt.Sprintf(":%s", port), r)
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
