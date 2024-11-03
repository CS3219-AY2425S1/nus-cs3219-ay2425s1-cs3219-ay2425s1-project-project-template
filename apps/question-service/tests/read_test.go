package tests

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"question-service/handlers"
	"strings"
	"testing"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go/v4"
	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
	"google.golang.org/api/option"
)

func createService(t testing.TB) *handlers.Service {
	err := godotenv.Load(filepath.Join("../", ".env"))
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	ctx := context.Background()
	client, err := initFirestore(ctx)

	if err != nil {
		t.Fatalf("failed to initialize Firestore: %v", err)
	}

	return &handlers.Service{Client: client}
}

// initFirestore initializes the Firestore client
func initFirestore(ctx context.Context) (*firestore.Client, error) {
	credentialsPath := "../" + os.Getenv("FIREBASE_CREDENTIAL_PATH")
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

func Test_Read(t *testing.T) {
	service := createService(t)
	res := httptest.NewRecorder()

	// adds chi context
	// https://stackoverflow.com/questions/54580582/testing-chi-routes-w-path-variables
	rctx := chi.NewRouteContext()
	rctx.URLParams.Add("docRefID", "6SdbW4Awcfm5x0UQtWmg")

	req := httptest.NewRequest(http.MethodGet, "http://localhost:8080/questions/6SdbW4Awcfm5x0UQtWmg", strings.NewReader(""))
	req = req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, rctx))

	service.ReadQuestion(res, req)

	if res.Result().StatusCode != 200 {
		t.Fatalf("expected status code 200 but got %v", res.Result())
	}
}
