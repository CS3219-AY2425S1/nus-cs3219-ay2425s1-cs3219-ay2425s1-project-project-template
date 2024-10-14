from flask import Blueprint, request, jsonify
import redis
import time
import os


bp = Blueprint("routes", __name__)

redis_client = redis.Redis(host="redis", port=6379, db=0)


@bp.route("/cancel", methods=["POST"])
def cancel_request():
    """Cancel a match request and update the state."""
    data = request.get_json()
    user_id = data.get("user_id")
    req_id = data.get("req_id")

    if not user_id or not req_id:
        return jsonify({"error": "Missing user_id or req_id"}), 400

    result = handle_cancellation(user_id, req_id)
    if result.get("status") == "cancellation_requested":
        return jsonify(result), 200
    else:
        return jsonify(result), 500


@bp.route("/can-queue", methods=["POST"])
def can_queue():
    """
    Check if the request can be added to RabbitMQ based on request time
    and if the state is still 'matching'. Return true if allowed, otherwise false.
    """
    data = request.get_json()
    user_id = data.get("user_id")
    request_time = data.get("request_time")
    if not user_id or not request_time:
        return jsonify({"error": "Missing user_id or request_time"}), 400

    previous_request_time = redis_client.hget(f"user:{user_id}", "request_time")
    state = redis_client.hget(f"user:{user_id}", "state")

    if not state:
        return jsonify({"can_add_to_queue": True}), 200
    state = state.decode("utf-8")
    if state == "questions_added" or state == "canceled":
        return jsonify({"can_add_to_queue": True}), 200
    if state == "matching" or state == "requested":
        if previous_request_time:
            previous_request_time = float(previous_request_time.decode("utf-8"))
            if float(request_time) - previous_request_time >= 30:
                return jsonify({"can_add_to_queue": True}), 200
            else:
                return jsonify({"can_add_to_queue": False}), 200
        else:
            return jsonify({"can_add_to_queue": True}), 200
    else:
        return jsonify({"can_add_to_queue": False}), 200


@bp.route("/can-proceed", methods=["POST"])
def can_proceed():
    data = request.get_json()
    user_id1 = data.get("user_id1")
    user_id2 = data.get("user_id2")

    if not user_id1 or not user_id2:
        return jsonify({"error": "Missing user_id1 or user_id2"}), 400

    user1_state = redis_client.hget(f"user:{user_id1}", "state")
    user2_state = redis_client.hget(f"user:{user_id2}", "state")

    if user1_state != b"cancelled" and user2_state != b"cancelled":
        return jsonify({"can_proceed": True}), 200

    cancelled_users = []
    if user1_state == b"cancelled":
        cancelled_users.append(user_id1)
    if user2_state == b"cancelled":
        cancelled_users.append(user_id2)

    return jsonify({"can_proceed": False, "cancelled_users": cancelled_users}), 200


def handle_cancellation(user_id, req_id):
    try:
        redis_client.hset(f"user:{user_id}", "state", "canceled")
        redis_client.hset(f"user:{user_id}", "req_id", req_id)

        print(f"Cancellation requested for user_id: {user_id}, req_id: {req_id}")
        return {"status": "cancellation_requested"}
    except Exception as e:
        print(f"Error handling cancellation: {e}")
        return {"status": "error", "message": str(e)}
