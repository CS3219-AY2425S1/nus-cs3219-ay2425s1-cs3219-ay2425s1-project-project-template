from confluent_kafka import Consumer, Producer
import json
import redis
import time
import uuid
import logging
import requests
import os

CONSUMER_CONFIG = {
    "bootstrap.servers": "kafka:9092",
    "group.id": "match-handler-group",
    "auto.offset.reset": "earliest",
}

PRODUCER_CONFIG = {
    "bootstrap.servers": "kafka:9092",
    "client.id": "match-handler",
}
REDIS_HOST = "redis"
REDIS_PORT = 6379
REDIS_DB = 0
RETRY_ATTEMPTS = 4
EXPIRATION_TIME = 28
KAFKA_FLUSH_TIMEOUT = 10

producer = None
redis_client = None

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s-%(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("match_handler")


def get_kafka_producer():
    global producer
    if producer is None:
        logger.info("Initializing Kafka producer...")
        producer = Producer(PRODUCER_CONFIG)
    return producer


def get_redis_client():
    global redis_client
    if redis_client is None:
        redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB)
    return redis_client


def main():
    consumer = Consumer(CONSUMER_CONFIG)
    producer = get_kafka_producer()
    r = get_redis_client()
    logger.info("Starting match handler...")
    try:
        consumer.subscribe(["match_requests"])
        print("Subscribed to match_requests topic")
        while True:
            msg = consumer.poll(1.0)

            if msg is None:
                continue
            if msg.error():
                logger.error(f"Consumer error: {msg.error()}")
                continue

            try:
                message = json.loads(msg.value().decode("utf-8"))
                process_message(message, r, producer)
            except json.JSONDecodeError as e:
                logger.error(f"Failed to decode JSON: {e}")
            except Exception as e:
                logger.error(f"Error processing message: {e}")

    except KeyboardInterrupt:
        logger.info("Shutting down consumer...")
    finally:
        consumer.close()


def process_message(message, redis_client, producer):
    user_id = message.get("user_id")
    category = message.get("category")
    difficulty = message.get("difficulty")
    request_time = message.get("request_time")
    expiration_time = request_time + EXPIRATION_TIME

    key = f"matching:{category}:{difficulty}"
    category_key = f"matching:{category}"
    logger.info(
        f"Received matching request: user_id={user_id}, category={category}, difficulty={difficulty}"
    )

    retry_attempts = RETRY_ATTEMPTS

    while retry_attempts > 0:
        try:
            current_time = time.time()
            min_timestamp = current_time - EXPIRATION_TIME

            remove_expired_entries(redis_client, key, category_key, min_timestamp)

            redis_client.watch(key, category_key)
            pipe = redis_client.pipeline()
            pipe.multi()

            for match_type in ["complete", "partial"]:
                res = find_and_handle_match(
                    redis_client,
                    pipe,
                    user_id,
                    key,
                    category_key,
                    min_timestamp,
                    match_type,
                    producer,
                    category,
                    difficulty,
                )
                if res is False:
                    return
                if res:
                    return

            logger.info("No match found, adding user to the matching queue...")
            add_user_to_matching_queue(
                pipe, user_id, key, category_key, expiration_time
            )
            log_redis_state(redis_client, key, category_key, user_id)
            return

        except redis.WatchError:
            logger.warning(
                "Transaction failed due to concurrent modification, retrying..."
            )
            pipe.reset()
            retry_attempts -= 1

    logger.error("Exceeded maximum retries. Exiting without processing the match.")


def find_and_handle_match(
    redis_client,
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
    matches = redis_client.zrangebyscore(
        key if match_type == "complete" else category_key, min_timestamp, "+inf"
    )
    logger.info(f"Found matches: {matches} for {match_type} matching.")

    for match in matches:
        match = match.decode("utf-8")
        logger.info(f"Attempting {match_type} match with {match}")
        can_proceed, cancelled_users = call_can_proceed(user_id, match)

        if can_proceed:
            logger.info(
                f"{match_type} match found: user_id={user_id} and match={match}"
            )
            remove_and_execute(pipe, key, category_key, match)
            push_to_kafka(match_type, user_id, match, category, difficulty, producer)
            return True

        if user_id in cancelled_users:
            logger.info(
                f"User {user_id} has cancelled its match request. Stop matching"
            )
            return False
        remove_and_execute(pipe, key, category_key, match)

    logger.info(f"No {match_type} matches found for user_id={user_id}.")
    return None


def remove_expired_entries(redis_client, key, category_key, min_timestamp):
    redis_client.zremrangebyscore(key, "-inf", min_timestamp)
    redis_client.zremrangebyscore(category_key, "-inf", min_timestamp)


def remove_and_execute(pipe, key, category_key, match):
    pipe.zrem(key, match)
    pipe.zrem(category_key, match)
    pipe.execute()


def add_user_to_matching_queue(pipe, user_id, key, category_key, expiration_time):
    pipe.zadd(key, {str(user_id): expiration_time})
    pipe.zadd(category_key, {str(user_id): expiration_time})
    pipe.execute()


def log_redis_state(redis_client, key, category_key, user_id):
    logger.info(
        f"Redis set '{key}' after adding user {user_id}: {redis_client.zrange(key, 0, -1, withscores=True)}"
    )
    logger.info(
        f"Redis set '{category_key}' after adding user {user_id}: {redis_client.zrange(category_key, 0, -1, withscores=True)}"
    )


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
    return True, []


def delivery_report(err, msg):
    """Callback called when message is delivered or if it fails."""
    if err is not None:
        logger.error(
            f"Message delivery failed: {err.str()} to {msg.topic()} [{msg.partition()}]"
        )
    else:
        logger.info(
            f"Message delivered to {msg.topic()} [{msg.partition()}] at offset {msg.offset()}"
        )


def push_to_kafka(match_type, user_id, match, category, difficulty, producer):
    try:
        match_result = {
            "user1_id": user_id,
            "user2_id": match,
            "category": category,
            "difficulty": difficulty,
            "uid": str(uuid.uuid4()),
        }

        logger.info(f"Producing {match_type} match result to Kafka: {match_result}")
        producer.produce(
            "match_results",
            key=str(user_id),
            value=json.dumps(match_result).encode("utf-8"),
            callback=delivery_report,
        )
        producer.flush(timeout=KAFKA_FLUSH_TIMEOUT)

    except Exception as e:
        logger.error(f"Error during match result processing: {e}")


if __name__ == "__main__":
    main()
