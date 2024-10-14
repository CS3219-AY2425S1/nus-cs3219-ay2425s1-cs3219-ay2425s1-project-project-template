from flask import Blueprint, request, jsonify
import time
from confluent_kafka import Producer, KafkaException
import json
import requests
import os
import uuid


from .producer import publish_to_matching_queue

matching_bp = Blueprint(
    "matching",
    __name__,
)


@matching_bp.route("/matching/cancel", methods=["POST"])
def cancel_matching():
    data = request.get_json()
    req_id = data.get("req_id")
    user_id = data.get("user_id")

    if not req_id or not user_id:
        return jsonify({"error": "req_id and user_id are required"}), 400

    # Publish a cancellation event with the req_id (assumes a publish_to_cancellation_queue function)
    event = {
        "event_type": "matching_canceled",
        "req_id": req_id,
        "user_id": user_id,
        "timestamp": time.time(),
    }

    error_response = publish_to_cancellation_queue(event)
    if error_response:
        print("error response", error_response)
        return jsonify(error_response), 500

    return jsonify({"message": "Matching request canceled", "req_id": req_id}), 200


producer_config = {
    "bootstrap.servers": "kafka:9092",
    "client.id": "matching-request",
}


def get_kafka_producer():
    """Lazily initialize Kafka producer"""
    if not hasattr(get_kafka_producer, "producer"):
        print("Initializing Kafka producer...")
        get_kafka_producer.producer = Producer(producer_config)
    return get_kafka_producer.producer


def delivery_report(err, msg):
    if err is not None:
        print("Message delivery failed: {}".format(err))
    else:
        print("Message delivered to {} [{}]".format(msg.topic(), msg.partition()))


@matching_bp.route("/matching", methods=["POST"])
def match_request():
    data = request.get_json()
    print("request data", data)
    user_id = data.get("user_id")
    category = data.get("category")
    difficulty = data.get("difficulty")

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    if not category:
        return jsonify({"error": "category is required"}), 400

    if not difficulty or difficulty not in ["easy", "medium", "hard"]:
        return (
            jsonify({"error": "difficulty must be one of 'easy', 'medium', or 'hard'"}),
            400,
        )
    req_time = time.time()
    matching_state_url = os.getenv("matching_state_url") + "/can-queue"
    res = requests.post(
        matching_state_url,
        json={
            "user_id": user_id,
            "request_time": req_time,
        },
    )
    if res.json().get("can_add_to_queue") is False:
        print(f"User {user_id} is already in the process of matching")
        return jsonify({"error": "User is already in the process of matching"}), 500
    message = {
        "user_id": user_id,
        "category": category,
        "difficulty": difficulty,
        "request_time": req_time,
    }
    kafka_producer = get_kafka_producer()

    try:
        kafka_producer.produce(
            "match_requests",
            key=str(user_id),
            value=json.dumps(message).encode("utf-8"),
            callback=delivery_report,
        )

        kafka_producer.flush()

    except KafkaException as e:
        print(f"Error while sending message to Kafka: {str(e)}")
        return (
            jsonify({"error": "Failed to send message to Kafka", "details": str(e)}),
            500,
        )

    req_id = str(uuid.uuid4())
    return jsonify({"message": "User is queued for matching", "req_id": req_id}), 200
