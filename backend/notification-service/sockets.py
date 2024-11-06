from app import app
from flask_socketio import emit, SocketIO
from flask import request
import sys

socketio = SocketIO(app, async_mode='eventlet', cors_allowed_origins="*")
connected_users = {}  # {user_id: socket_id}
matching_service_sid = None

@socketio.on("connect")
def handle_connect():
    role = request.args.get("role")
    user_id = request.args.get("user_id")

    if role == "matching_service":
        global matching_service_sid
        matching_service_sid = request.sid
        print(f"Matching service connected with socket ID {request.sid}")
    elif role == "user" and user_id:
        connected_users[user_id] = request.sid
        print(f"User {user_id} connected with socket ID {request.sid}")


@socketio.on("match_found")
def handle_match_found(data):
    user1_id, user2_id = data.get("user1Id"), data.get("user2Id")
    user1_name, user2_name = data.get("user1Name"), data.get("user2Name")
    match_message = data.get("message")
    match_topic = data.get("match_topic")
    match_difficulty = data.get("match_difficulty")
    user1_socket_id, user2_socket_id = connected_users.get(user1_id), connected_users.get(user2_id)

    # Notify user 1 if connected
    if user1_socket_id:
        emit("notification", {"match": user2_name, "match_message": match_message, "match_topic": match_topic, "match_difficulty": match_difficulty}, room=user1_socket_id)
        print(f"Notification sent to user {user1_name} about user {user2_name}", file=sys.stderr)
    else:
        print(f"User {user1_name} is not connected", file=sys.stderr)

    # Notify user 2 if connected
    if user2_socket_id:
        emit("notification", {"match": user1_name, "match_message": match_message, "match_topic": match_topic, "match_difficulty": match_difficulty}, room=user2_socket_id)
        print(f"Notification sent to user {user2_name} about user {user1_name}", file=sys.stderr)
    else:
        print(f"User {user2_name} is not connected", file=sys.stderr)


@socketio.on("disconnect")
def handle_disconnect():
    global matching_service_sid

    if request.sid == matching_service_sid:
        matching_service_sid = None
        print("Matching service disconnected")
        return

    disconnected_user = None
    for user_id, socket_id in connected_users.items():
        if socket_id == request.sid:
            disconnected_user = user_id
            break
    connected_users.pop(disconnected_user, None)
    print(f"User {disconnected_user} disconnected")
