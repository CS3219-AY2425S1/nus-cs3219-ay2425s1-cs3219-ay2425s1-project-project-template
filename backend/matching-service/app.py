from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pika
from dotenv import load_dotenv
import json
import sys
import threading
import socketio
import time

load_dotenv()
app = Flask(__name__)
CORS(app)
sio = socketio.Client()
NOTIFICATION_SERVICE = NOTIFICATION_SERVICE = os.getenv('NOTIFICATION_SERVICE', 'http://localhost:5000')

PORT = int(os.environ.get('PORT', 5001))
RABBITMQ_HOST = os.getenv('RABBITMQ_HOST')

def produce_message(message):
    try:
        credentials = pika.PlainCredentials('peerprep', 'peerprep')
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST, credentials=credentials))
        channel = connection.channel()
        channel.queue_declare(queue='match_queue')
        channel.basic_publish(exchange='',
                            routing_key='match_queue',
                            body=message)
        
        print(f" [x] Sent '{message}'")
    except Exception as e:
        print("Failed: " + str(e), file=sys.stderr)

pending_requests = []


def match_user(request):
    print(f"trying to find matches with incoming request {request}")
    topic, difficulty = request['topic'], request['difficulty']
    user1 = request

    for pending in pending_requests:
        user2 = pending

        if pending['topic'] == topic and pending['difficulty'] == difficulty:
            print(f"MATCHED {user1['username']} with {user2['username']}")
            sio.emit("match_found", get_match_payload(user1, user2, "Matched on difficulty and topic"))
            pending_requests.remove(pending)
            return
        elif pending['topic'] == topic:
            print(f"MATCHED {user1['username']} with {user2['username']}")
            sio.emit("match_found", get_match_payload(user1, user2, "Matched on topic"))
            pending_requests.remove(pending)
            return
        elif pending['difficulty'] == difficulty:
            print(f"MATCHED {user1['username']} with {user2['username']}")
            sio.emit("match_found", get_match_payload(user1, user2, "Matched on difficulty"))
            pending_requests.remove(pending)
            return

    # No match found; add to pending requests
    pending_requests.append(request)

    # Set timer to remove the request after 60 seconds
    threading.Timer(60.0, remove_request, [request]).start()


def get_match_payload(user1, user2, match_message):
    return {
        "user1Id": user1['userId'],
        "user1Name": user1['username'],
        "user2Id": user2['userId'],
        "user2Name": user2['username'],
        "message": match_message
    }


def remove_request(request):
    if request in pending_requests:
        pending_requests.remove(request)


def consume_messages():
    try:
        credentials = pika.PlainCredentials('peerprep', 'peerprep')
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST, credentials=credentials))
        channel = connection.channel()

        channel.queue_declare(queue='match_queue')

        def callback(ch, method, properties, body):
            print(f" [x] Received {body}")
            request = json.loads(body)
            match_user(request)

        channel.basic_consume(queue='match_queue', on_message_callback=callback, auto_ack=True)

        print(' [*] Waiting for messages. To exit press CTRL+C')
        channel.start_consuming()
    except Exception as e:
        print("Failed: " + str(e), file=sys.stderr)


@sio.event
def connect():
    print("Connected to notification service")

@sio.event
def disconnect():
    print("Disconnected from notification service")

@app.get('/')
def home():
    return f"Server is running on port {PORT}"

@app.route('/enqueue', methods=['POST'])
def queue():
    data = json.dumps(request.get_json())
    produce_message(data)

    return jsonify({"status": "Message sent to RabbitMQ", "message": data}), 200

if __name__ == '__main__':
    print(f"Running on port {PORT}")
    
    while True:
        try:
            print("Attempting to connect to notification service...")
            sio.connect(NOTIFICATION_SERVICE)
            print("Successfully connected to notification service!")
            break
        except Exception as e:
            print(f"Failed to connect to notification service: {e}")
            print("Retrying in 5 seconds...")
            time.sleep(5)
    
    consumer_thread = threading.Thread(target=consume_messages)
    consumer_thread.daemon = True
    consumer_thread.start()
    app.run(host='0.0.0.0', port=PORT, debug=False)
