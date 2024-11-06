package messagequeue

import (
	"execution-service/utils"
	"fmt"
	"log"
	"os"

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

	// Declare a queue
	q, err := ch.QueueDeclare(
		CODE_SUBMISSION_QUEUE_KEY, // name
		false,                     // durable
		false,                     // delete when unused
		false,                     // exclusive
		false,                     // no-wait
		nil,                       // arguments
	)
	utils.FailOnError(err, "Failed to declare a queue")
	codeSubmissionQueue = q

	return ch
}

func PublishSubmissionMessage(submission []byte) error {
	err := rabbitMQChannel.Publish(
		"",                       // exchange
		codeSubmissionQueue.Name, // routing key
		false,                    // mandatory
		false,                    // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        submission,
		})
	if err != nil {
		return fmt.Errorf("Failed to publish a message: %v", err)
	}
	log.Printf("RabbitMQ: [x] Sent %s", submission)
	return nil
}
