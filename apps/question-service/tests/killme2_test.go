package tests

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
)

func Test2(t *testing.T) {
	err := os.Setenv("FIRESTORE_EMULATOR_HOST", "localhost:9000")

	if err != nil {
		t.Fatalf("failed to setup env")
	}

	service := createService()
	response := httptest.NewRecorder()

	service.ReadQuestion(
		response,
		httptest.NewRequest(http.MethodGet, "/questions/6SdbW4Awcfm5x0UQtWmg", strings.NewReader("")),
	)
	fmt.Printf("%v", response.Result())
}

// func TestMain
// func createService()
