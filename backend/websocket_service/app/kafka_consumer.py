from confluent_kafka import Consumer, KafkaError, KafkaException
import json
import asyncio
import logging
import redis

# Set up the logger
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

redis_client = redis.Redis(host="redis", port=6379, db=0)


async def kafka_consumer():
    """Asynchronously consume messages from Kafka with exponential backoff on connection failure."""
    consumer_config = {
        "bootstrap.servers": "kafka:9092",
        "group.id": "fastapi-consumer-group",
        "auto.offset.reset": "earliest",
    }

    max_retries = 10
    initial_delay = 1
    backoff_factor = 2

    for attempt in range(max_retries):
        try:
            logger.info("Attempting to connect to Kafka")
            consumer = Consumer(consumer_config)
            logger.info("Connected to Kafka successfully")
            consumer.subscribe(["match_requests", "match_results", "question_results"])
            logger.info(
                "Subscribe to match_requests, match_results and question_results topics"
            )
            break
        except Exception as e:
            # Calculate the exponential backoff delay
            delay = initial_delay * (backoff_factor**attempt)
            logger.error(
                f"Error connecting to Kafka broker: {str(e)}. Retrying in {delay:.2f} seconds..."
            )
            # Sleep for the calculated backoff delay
            await asyncio.sleep(delay)
    else:
        raise Exception(
            "Failed to connect to Kafka broker after multiple attempts with exponential backoff."
        )

    while True:
        try:
            msg = consumer.poll(1.0)
            if msg is None:
                await asyncio.sleep(0.1)
                continue

            if msg.error():
                logger.error(f"Kafka error: {msg.error()}")
                continue
            message_value = msg.value().decode("utf-8")
            topic = msg.topic()
            message = json.loads(message_value)
            if topic == "match_requests":
                logger.info(f"Received message from match_requests: {message_value}")
                user_id = message.get("user_id")
                if user_id:
                    redis_client.hset(f"user:{user_id}", "state", "matching")
                    redis_client.hset(
                        f"user:{user_id}", "request_time", message.get("request_time")
                    )
                    logger.info(f"Set user {user_id} to state: matching")
                else:
                    logger.error(
                        f"Invalid message received for match_requests topic: {message_value}"
                    )
            elif topic == "match_results":
                logger.info(f"Received message from match_results: {message_value}")
                user1_id = message.get("user1_id")
                user2_id = message.get("user2_id")
                if user1_id and user2_id:
                    redis_client.hset(f"user:{user1_id}", "state", "matched")
                    redis_client.hset(f"user:{user2_id}", "state", "matched")
                    logger.info(
                        f"Set user {user1_id} and user {user2_id} to state: matched"
                    )
                else:
                    logger.error(
                        f"Invalid message received for match_result topic: {message_value}"
                    )

            elif topic == "question_results":
                logger.info(f"Received message from question_results: {message_value}")
                user1_id = message.get("user1_id")
                user2_id = message.get("user2_id")
                if user1_id and user2_id:
                    redis_client.hset(f"user:{user1_id}", "state", "qn_assgined")
                    redis_client.hset(f"user:{user2_id}", "state", "qn_assgined")
                    logger.info(
                        f"Set user {user1_id} and user {user2_id} to state: qn_assigined"
                    )
                    yield json.loads(message_value)

                else:
                    logger.error(
                        f"Invalid message received for question_result topic: {message_value}"
                    )
            consumer.commit(msg)
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")
