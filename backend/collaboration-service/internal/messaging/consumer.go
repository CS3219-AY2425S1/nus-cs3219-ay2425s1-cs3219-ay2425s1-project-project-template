package messaging

import (
	"collaboration-service/internal/config"
	"collaboration-service/internal/models"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	
	"io/ioutil"

	"github.com/streadway/amqp"
)

func StartRabbitMQ() {
	// Retrieve RabbitMQ and Questions API URLs from environment variables
	rabbitMQUrl := os.Getenv("RABBITMQ_URL")
	questionsAPIUrl := os.Getenv("QUESTIONS_API_URL")

	db := config.GetCollection("matches")
	conn, err := amqp.Dial(rabbitMQUrl)
	if err != nil {
		log.Fatal("Failed to connect to RabbitMQ:", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatal("Failed to open a channel:", err)
	}
	defer ch.Close()

	queueName := "match_queue"

	// Declare a queue
	_, err = ch.QueueDeclare(queueName, false, false, false, false, nil)
	if err != nil {
		log.Fatal("Failed to declare a queue:", err)
	}

	// Consume messages
	msgs, err := ch.Consume(queueName, "", true, false, false, false, nil)
	if err != nil {
		log.Fatal("Failed to register a consumer:", err)
	}

	fmt.Println("[*] Waiting for messages. To exit press CTRL+C")

	// Loop through the messages
	for msg := range msgs {
		var matchResult models.Match
		err := json.Unmarshal(msg.Body, &matchResult)
		if err != nil {
			log.Println("Failed to unmarshal message:", err)
			continue
		}

		fmt.Printf("Received message: %+v\n", matchResult)

		// Fetch a question based on categories and complexity
		question, err := fetchQuestion(matchResult.Categories, matchResult.Complexity, questionsAPIUrl)
		if err != nil {
			log.Println("Failed to fetch question:", err)
			continue
		}

		// Store the fetched question in the match result
		matchResult.Question = question

		// Save the match result to MongoDB
		_, err = db.InsertOne(context.TODO(), matchResult)
		if err != nil {
			log.Println("Failed to save match to MongoDB:", err)
			continue
		}

		fmt.Println("Match saved to MongoDB:", matchResult)
	}
}

// fetchQuestion makes API calls to get a single question based on categories and complexity
func fetchQuestion(categories []string, complexity []models.QuestionComplexityEnum, apiURL string) (models.Question, error) {
	// Prepare request
	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		return models.Question{}, err
	}

	// Add query parameters
	q := req.URL.Query()
	for _, category := range categories {
		q.Add("categories", category)
	}
	for _, comp := range complexity {
		q.Add("complexity", string(comp)) // Convert the enum to string for query parameter
	}
	req.URL.RawQuery = q.Encode()

	// Perform the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return models.Question{}, err
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return models.Question{}, err
	}

	// Log the response for debugging
	log.Printf("Response from question API: %s", string(body))

	// Unmarshal the response directly into a single Question object
	var question models.Question
	err = json.Unmarshal(body, &question)
	if err != nil {
		return models.Question{}, err
	}

	return question, nil
}
