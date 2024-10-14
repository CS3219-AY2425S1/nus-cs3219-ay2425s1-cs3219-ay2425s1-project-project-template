from app import app
from flask_socketio import emit, SocketIO
from flask import request

socketio = SocketIO(app, async_mode='eventlet', cors_allowed_origins="http://localhost:3000")
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
    user1_id = data.get("user1Id")
    user2_id = data.get("user2Id")

    user1_socket_id = connected_users.get(user1_id)
    user2_socket_id = connected_users.get(user2_id)

    # Notify user 1 if connected
    if user1_socket_id:
        emit("notification", {"data": data['user2Name']}, room=user1_socket_id)
        print(f"Notification sent to user {user1_id} about user {data['user2Name']}")
    else:
        print(f"User {user1_id} is not connected")

    # Notify user 2 if connected
    if user2_socket_id:
        emit("notification", {"data": data['user1Name']}, room=user2_socket_id)
        print(f"Notification sent to user {user2_id} about user {data['user1Name']}")
    else:
        print(f"User {user2_id} is not connected")


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
