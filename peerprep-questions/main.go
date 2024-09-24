package main

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"

	"github.com/CS3219-AY2425S1/cs3219-ay2425s1-project-g32/peerprep-questions/controller"
)

func main() {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Route("/question", func(r chi.Router) {
		r.Get("/", controller.ListQuestions)
		r.Post("/", controller.CreateQuestion)
		r.Put("/{id}", controller.UpdateQuestion)
		r.Delete("/{id}", controller.DeleteQuestion)
		r.Get("/{id}", controller.GetQuestion)
	})
	fmt.Println("Running on port 3000")
	http.ListenAndServe(":3000", r)
}
