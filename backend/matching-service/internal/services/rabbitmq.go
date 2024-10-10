package services

import (
	"fmt"
	"log"
	"sync"

	"github.com/streadway/amqp"
)

type RabbitMQService struct {
	conn         *amqp.Connection
	channel      *amqp.Channel
	queueTracker map[string]bool // Track declared queues
	mu           sync.Mutex      // Ensure thread-safe access to queueTracker
}

func NewRabbitMQService() (*RabbitMQService, error) {
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		return nil, fmt.Errorf("failed to connect to RabbitMQ: %w", err)
	}

	channel, err := conn.Channel()
	if err != nil {
		return nil, fmt.Errorf("failed to open a channel: %w", err)
	}

	// Declare the exchange
	err = channel.ExchangeDeclare(
		"peer-match-exchange", // exchange name
		"direct",              // exchange type
		true,                  // durable
		false,                 // auto-deleted
		false,                 // internal
		false,                 // no-wait
		nil,                   // arguments
	)
	if err != nil {
		return nil, fmt.Errorf("failed to declare exchange: %w", err)
	}

	return &RabbitMQService{
		conn:         conn,
		channel:      channel,
		queueTracker: make(map[string]bool), // Initialize the queue tracker map
	}, nil
}

func (r *RabbitMQService) Close() {
	r.channel.Close()
	r.conn.Close()
}

// Dynamically declare the queue only if it hasn't been declared yet
func (r *RabbitMQService) ensureQueueDeclared(queueName, routingKey string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	// Check if the queue has already been declared
	if _, exists := r.queueTracker[queueName]; !exists {
		_, err := r.channel.QueueDeclare(
			queueName,
			true,  // Durable
			false, // Auto-delete
			false, // Exclusive
			false, // No-wait
			nil,   // Arguments
		)
		if err != nil {
			return fmt.Errorf("failed to declare queue: %w", err)
		}

		// Bind the queue to the exchange
		err = r.channel.QueueBind(
			queueName,
			routingKey,
			"peer-match-exchange", // Exchange name
			false,
			nil,
		)
		if err != nil {
			return fmt.Errorf("failed to bind queue to exchange: %w", err)
		}

		// Mark the queue as declared
		r.queueTracker[queueName] = true
		log.Printf("Queue %s declared and bound to exchange with routing key %s", queueName, routingKey)
	}

	return nil
}

func (r *RabbitMQService) PublishMatchRequest(userID, topic, experienceLevel string) error {
	routingKey := fmt.Sprintf("topic.%s.level.%s", topic, experienceLevel)
	messageBody := fmt.Sprintf(`{"userID":"%s","topic":"%s","experienceLevel":"%s"}`, userID, topic, experienceLevel)

	queueName := routingKey // Use the routing key as the queue name for simplicity

	// Ensure the queue is declared dynamically
	if err := r.ensureQueueDeclared(queueName, routingKey); err != nil {
		return fmt.Errorf("failed to ensure queue: %w", err)
	}

	// Publish the message to the correct exchange with the appropriate routing key
	err := r.channel.Publish(
		"peer-match-exchange", // Exchange name
		routingKey,            // Routing key
		false,                 // Mandatory
		false,                 // Immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        []byte(messageBody),
		},
	)
	if err != nil {
		return fmt.Errorf("failed to publish message: %w", err)
	}

	log.Printf("Published message to %s: %s", routingKey, messageBody)
	return nil
}

func (r *RabbitMQService) DeclareQueueAndConsume(queueName string, handler func(amqp.Delivery) error) error {
	msgs, err := r.channel.Consume(
		queueName,
		"",
		false, // Auto-ack is false
		false, // Non-exclusive
		false, // No-local
		false, // No-wait
		nil,   // Arguments
	)
	if err != nil {
		return fmt.Errorf("failed to consume from queue: %w", err)
	}

	go func() {
		for msg := range msgs {
			if err := handler(msg); err != nil {
				log.Printf("Error processing message: %v", err)
			}
		}
	}()

	return nil
}
