from app import socketio
from flask_socketio import emit
from flask import request
import logging

# Set up logging configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

connected_users = {}

@socketio.on('connect')
def handle_connect():
    user_id = request.args.get('user_id')
    connected_users[user_id] = request.sid
    logger.info(f'User {user_id} connected with socket ID {request.sid}')
    emit('notification', {'data': 'Connected!'}, room=request.sid)

@socketio.on('match_found')
def handle_match_found(data):
    user1_id = data.get('user1Id')
    user2_id = data.get('user2Id')
    user1_socket_id = connected_users.get(user1_id)
    user2_socket_id = connected_users.get(user2_id)

    # Notify user 1 if connected
    if user1_socket_id:
        emit('notification', {'data': f'Match found with {data["user2Name"]}!'}, room=user1_socket_id)
        logger.info(f'Notification sent to user {user1_id} about user {data["user2Name"]}')
    else:
        logger.warning(f'User {user1_id} is not connected')

    # Notify user 2 if connected
    if user2_socket_id:
        emit('notification', {'data': f'Match found with {data["user1Name"]}!'}, room=user2_socket_id)
        logger.info(f'Notification sent to user {user2_id} about user {data["user1Name"]}')
    else:
        logger.warning(f'User {user2_id} is not connected')

@socketio.on('disconnect')
def handle_disconnect():
    disconnected_user = None
    for user_id, socket_id in connected_users.items():
        if socket_id == request.sid:
            disconnected_user = user_id
            break
    if disconnected_user:
        logger.info(f'User {disconnected_user} disconnected')
        connected_users.pop(disconnected_user, None)
    else:
        logger.info('Unknown client disconnected')
