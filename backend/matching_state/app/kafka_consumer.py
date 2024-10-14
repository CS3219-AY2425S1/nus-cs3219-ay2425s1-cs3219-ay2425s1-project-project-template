import sys
import os
import time
import json
import redis
from confluent_kafka import Consumer, KafkaError
import logging

# Configure logging
# logging.basicConfig(
#     level=logging.INFO,
#     format="%(asctime)s %(levelname)s %(message)s",
# )

# logger = logging.getLogger(__name__)


consumer_config = {
    "bootstrap.servers": "kafka:9092",
    "group.id": "matching_state_group",
    "auto.offset.reset": "earliest",
}


def listen_for_updates():
    redis_client = redis.Redis(host="redis", port=6379, db=0)
    print("Kafka Consumer started, listening for messages...")
    connected = False
    retry_count = 0
    backoff_time = 1
    max_retries = 5
    max_backoff = 16
    while not connected and retry_count < max_retries:
        try:
            consumer = Consumer(consumer_config)
            consumer.subscribe(["match_requests", "match_results", "question_results"])
            connected = True
            print("Connected to Kafka successfully.")
        except KafkaError as e:
            retry_count += 1
            print(
                f"Failed to connect to Kafka (attempt {retry_count}/{max_retries}): {e}"
            )
            if retry_count >= max_retries:
                print("Max retries reached. Exiting.")
                sys.exit(1)
            time.sleep(backoff_time)
            backoff_time = min(backoff_time * 2, max_backoff)

    while True:
        try:
            msg = consumer.poll(1.0)
            if msg is None:
                continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    continue
                else:
                    print(f"Kafka error: {msg.error()}")
                    break

            message_value = msg.value().decode("utf-8")
            topic = msg.topic()
            message = json.loads(message_value)
            if topic == "match_requests":
                print(f"Received message from match_requests: {message_value}")
                user_id = message.get("user_id")
                if user_id:
                    redis_client.hset(f"user:{user_id}", "state", "matching")
                    redis_client.hset(
                        f"user:{user_id}", "request_time", message.get("request_time")
                    )
                    print(f"Set user {user_id} to state: matching")
                    continue
                print(
                    f"Invalid message received for match_requests topic: {message_value}"
                )
            elif topic == "match_results":
                print(f"Received message from match_results: {message_value}")
                user_id1 = message.get("user_id1")
                user_id2 = message.get("user_id2")
                if user_id1 and user_id2:
                    redis_client.hset(f"user:{user_id1}", "state", "matched")
                    redis_client.hset(f"user:{user_id2}", "state", "matched")
                    print(f"Set user {user_id1} and user {user_id2} to state: matched")
                    continue
                print(
                    f"Invalid message received for match_result topic: {message_value}"
                )

            elif topic == "question_results":
                print(f"Received message from question_results: {message_value}")
                user_id1 = message.get("user_id1")
                user_id2 = message.get("user_id2")
                if user_id1 and user_id2:
                    redis_client.hset(f"user:{user_id1}", "state", "qn_assgined")
                    redis_client.hset(f"user:{user_id2}", "state", "qn_assgined")
                    print(
                        f"Set user {user_id1} and user {user_id2} to state: qn_assgined"
                    )
                    continue
                print(
                    f"Invalid message received for question_result topic: {message_value}"
                )
        except Exception as e:
            print(f"Exception in message processing loop: {e}")

    consumer.close()
    print("Kafka Consumer stopped.")


if __name__ == "__main__":
    try:
        listen_for_updates()
    except Exception as e:
        print(str(e))
        print("Unhandled exception in kafka_consumer.py")
        sys.exit(1)
