import uuid
from .celery import (
    app,
)
import requests
import time
import redis
import json
import os
from confluent_kafka import Producer

# Initialize Redis client
r = redis.Redis(host="redis", port=6379, db=0)
producer_config = {"bootstrap.servers": "kafka:9092", "debug": "broker, msg"}


def get_kafka_producer():
    """Lazily initialize Kafka producer"""
    if not hasattr(get_kafka_producer, "producer"):
        print("Initializing Kafka producer...")
        get_kafka_producer.producer = Producer(producer_config)
    return get_kafka_producer.producer


def call_can_proceed(user1_id, user2_id):
    url = os.getenv("matching_state_url") + "/can-proceed"
    print("matching_state_url", url)
    print(f"Checking if users {user1_id} and {user2_id} can proceed with the match")
    res = requests.post(
        url,
        json={
            "user1_id": user1_id,
            "user2_id": user2_id,
        },
    )
    res_json = res.json()
    if res_json.get("can_proceed") is False:
        return False, res_json.get("cancelled_users")
    return True, None


@app.task(
    name="process_match",
    queue="matching_queue",
    bind=True,
    max_retries=3,
)
def process_matching_request(self, user_data):
    """Main function to process a user matching request."""
    user_id = user_data["user_id"]
    category = user_data["category"]
    difficulty = user_data["difficulty"]
    request_time = user_data["request_time"]
    expiration_time = request_time + 28

    print(
        f"Received matching request: user_id={user_id}, category={category}, difficulty={difficulty}"
    )

    key = f"matching:{category}:{difficulty}"
    category_key = f"matching:{category}"

    producer = get_kafka_producer()
    retry_attempts = 4

    while retry_attempts > 0:
        try:
            current_time = time.time()
            min_timestamp = current_time - 28

            remove_expired_entries(r, key, category_key, min_timestamp)

            r.watch(key, category_key)
            pipe = r.pipeline()
            pipe.multi()

            if find_and_handle_match(
                r,
                pipe,
                user_id,
                key,
                category_key,
                min_timestamp,
                "complete",
                producer,
                category,
                difficulty,
            ):
                return
            print("No complete match found, checking for partial matches...")
            if find_and_handle_match(
                r,
                pipe,
                user_id,
                key,
                category_key,
                min_timestamp,
                "partial",
                producer,
                category,
                difficulty,
            ):
                return

            print("No partial match found, adding user to the matching queue...")
            add_user_to_matching_queue(
                pipe, user_id, key, category_key, expiration_time
            )
            print(
                f"Redis set '{key}' after adding user {user_id}: {r.zrange(key, 0, -1, withscores=True)}"
            )
            print(
                f"Redis set '{category_key}' after adding user {user_id}: {r.zrange(category_key, 0, -1, withscores=True)}"
            )
            print("User added to the matching queue.")
            return

        except redis.WatchError:
            print("Transaction failed due to concurrent modification, retrying...")
            if pipe:
                pipe.reset()
            retry_attempts -= 1

    print("Exceeded maximum retries. Exiting without processing the match.")


def remove_expired_entries(r, key, category_key, min_timestamp):
    r.zremrangebyscore(key, "-inf", min_timestamp)
    r.zremrangebyscore(category_key, "-inf", min_timestamp)


def find_and_handle_match(
    r,
    pipe,
    user_id,
    key,
    category_key,
    min_timestamp,
    match_type,
    producer,
    category,
    difficulty,
):
    matches = r.zrangebyscore(
        key if match_type == "complete" else category_key, min_timestamp, "+inf"
    )
    print(f"Found matches: {matches} for {match_type} matching.")
    match_index = 0

    while match_index < len(matches):
        match = matches[match_index].decode("utf-8")
        print(f"Attempting match with {match}")
        can_proceed, cancelled_users = call_can_proceed(user_id, match)

        if can_proceed:
            print(f"Match found: user_id={user_id} and match={match}")
            remove_and_execute(pipe, key, category_key, match)
            push_to_kafka(user_id, match, category, difficulty, producer)
            return True

        if user_id in cancelled_users:
            print(f"Match {match} was cancelled, skipping.")
            return True

        # No match, continue with the next candidate
        remove_and_execute(pipe, key, category_key, match)
        match_index += 1

    print(f"No {match_type} matches found for user_id={user_id}.")
    return False


def remove_and_execute(pipe, key, category_key, match):
    pipe.zrem(key, match)
    pipe.zrem(category_key, match)
    pipe.execute()


def add_user_to_matching_queue(pipe, user_id, key, category_key, expiration_time):
    pipe.zadd(key, {str(user_id): expiration_time})
    pipe.zadd(category_key, {str(user_id): expiration_time})
    pipe.execute()
    print(
        f"No complete or partial match found for user_id={user_id}, added to category matching queue: {category_key}"
    )


def delivery_report(record_metadata, exception):
    if exception is not None:
        print(f"Message delivery failed: {exception}")
    else:
        print(
            f"Message delivered to {record_metadata.category} "
            f"partition {record_metadata.partition} "
            f"offset {record_metadata.offset}"
        )


def push_to_kafka(user_id, match, category, difficulty, producer):
    try:
        match_result = {
            "user1_id": user_id,
            "user2_id": match,
            "category": category,
            "difficulty": difficulty,
            "uid": str(uuid.uuid4()),
        }

        print(f"Producing match result to Kafka: {match_result}")
        producer.produce(
            "match_results",
            key=str(user_id),
            value=json.dumps(match_result).encode("utf-8"),
            callback=delivery_report,
        )
        producer.flush(timeout=10)

    except Exception as e:
        print(f"Error during match result processing: {e}")
