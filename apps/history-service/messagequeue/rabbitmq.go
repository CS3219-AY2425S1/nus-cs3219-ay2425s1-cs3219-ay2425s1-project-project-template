package messagequeue

import (
	"context"
	"encoding/json"
	"history-service/models"
	"history-service/utils"
	"log"
	"os"

	"cloud.google.com/go/firestore"
	amqp "github.com/rabbitmq/amqp091-go"
)

const CODE_SUBMISSION_QUEUE_KEY = "code-submission"

var (
	codeSubmissionQueue amqp.Queue
	rabbitMQChannel     *amqp.Channel
)

func InitRabbitMQServer() *amqp.Channel {
	// Connect to RabbitMQ server
	rabbitMQURL := os.Getenv("RABBITMQ_URL")
	conn, err := amqp.Dial(rabbitMQURL)
	utils.FailOnError(err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	// Create a channel
	ch, err := conn.Channel()
	utils.FailOnError(err, "Failed to open a channel")
	rabbitMQChannel = ch
	defer ch.Close()

	// Declare a queue
	q, err := ch.QueueDeclare(
		"code-submission", // name
		false,             // durable
		false,             // delete when unused
		false,             // exclusive
		false,             // no-wait
		nil,               // arguments
	)
	utils.FailOnError(err, "Failed to declare a queue")
	codeSubmissionQueue = q

	return ch
}

func ConsumeSubmissionMessages(client *firestore.Client, createSubmission func(
	*firestore.Client, context.Context, models.SubmissionHistory) (
	*firestore.DocumentRef, error)) {
	ctx := context.Background()

	// Consume messages from the queue
	msgs, err := rabbitMQChannel.Consume(
		codeSubmissionQueue.Name, // queue
		"",                       // consumer
		true,                     // auto-ack
		false,                    // exclusive
		false,                    // no-local
		false,                    // no-wait
		nil,                      // args
	)
	utils.FailOnError(err, "Failed to register a consumer")

	// Create a channel to block indefinitely
	forever := make(chan bool)

	// Start a goroutine to handle incoming messages
	go func() {
		for d := range msgs {
			log.Printf("RabbitMQ: Received a message: %v", d)

			// Parse request
			var submissionHistory models.SubmissionHistory
			if err := json.Unmarshal(d.Body, &submissionHistory); err != nil {
				log.Printf("RabbitMQ: Error decoding JSON: %v", err)
				continue
			}

			_, err := createSubmission(client, ctx, submissionHistory)
			if err != nil {
				log.Printf("RabbitMQ: %v", err)
			}
		}
	}()

	log.Printf("RabbitMQ: [*] Waiting for messages.")
	<-forever
}
