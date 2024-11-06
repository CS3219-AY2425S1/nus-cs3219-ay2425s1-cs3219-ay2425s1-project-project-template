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
import traceback
import ssl

load_dotenv()
app = Flask(__name__)
CORS(app)
sio = socketio.Client()
NOTIFICATION_SERVICE = "https://notification-service-313275155433.asia-southeast1.run.app" \
if os.getenv('ENV') == "PROD" else os.getenv('NOTIFICATION_SERVICE', 'http://localhost:5000')

PORT = int(os.environ.get('PORT', 5001))
RABBITMQ_HOST = os.getenv('RABBITMQ_HOST')
ssl_context = ssl.create_default_context()

def produce_message(message):
    try:
        if os.getenv('ENV') == "PROD":
            credentials = pika.PlainCredentials(os.getenv('RABBITMQ_USER'), 
                                                os.getenv('RABBITMQ_PASSWORD'))
            parameters = pika.ConnectionParameters(host=RABBITMQ_HOST,
                                                   port=5671,
                                                   virtual_host=os.getenv('RABBITMQ_VHOST'), 
                                                   credentials=credentials, 
                                                   ssl_options=pika.SSLOptions(ssl_context))
            connection = pika.BlockingConnection(parameters)
        else:
            credentials = pika.PlainCredentials('peerprep', 'peerprep')
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(host=RABBITMQ_HOST, credentials=credentials))
        print("connection ready")
        
        channel = connection.channel()
        channel.queue_declare(queue='match_queue')
        channel.basic_publish(exchange='',
                            routing_key='match_queue',
                            body=message)
        
        print(f" [x] Sent '{message}'", file=sys.stderr)
    except Exception as e:
        print("Failed: " + str(e), file=sys.stderr)

pending_requests = []


def match_user(request):
    print(f"trying to find matches with incoming request {request}", file=sys.stderr)
    topic, difficulty, userId, cancel = request['topic'], request['difficulty'], request['userId'], request['cancel']
    user1 = request
    print(pending_requests, file=sys.stderr)
    for pending in pending_requests:
        user2 = pending

        if cancel:
            # Cancel request
            if pending['userId'] == userId:
                print(f"Deleting: {user2}", file=sys.stderr)
                pending_requests.remove(pending)
            else:
                continue
        elif pending['topic'] == topic and pending['difficulty'] == difficulty:
            print(f"MATCHED {user1['username']} with {user2['username']}", file=sys.stderr)
            sio.emit("match_found", get_match_payload(user1, user2, topic, difficulty, f"Matched on difficulty: {difficulty} and topic: {topic}"))
            pending_requests.remove(pending)
            print("Sent match found event", file=sys.stderr)
            print("New pending requests list: " + str(pending_requests), file=sys.stderr)
            return
        elif pending['topic'] == topic:
            print(f"MATCHED {user1['username']} with {user2['username']}", file=sys.stderr)
            sio.emit("match_found", get_match_payload(user1, user2, topic, difficulty, f"Matched on topic: {topic}"))
            pending_requests.remove(pending)
            return
        elif pending['difficulty'] == difficulty:
            print(f"MATCHED {user1['username']} with {user2['username']}", file=sys.stderr)
            sio.emit("match_found", get_match_payload(user1, user2, topic, difficulty, f"Matched on difficulty: {difficulty}"))
            pending_requests.remove(pending)
            return

    # No match found; add to pending requests
    if not cancel:
        pending_requests.append(request)

    # Set timer to remove the request after 60 seconds
    threading.Timer(60.0, remove_request, [request]).start()


def get_match_payload(user1, user2, match_topic, match_difficulty, match_message):
    return {
        "user1Id": user1['userId'],
        "user1Name": user1['username'],
        "user2Id": user2['userId'],
        "user2Name": user2['username'],
        "message": match_message,
        "match_topic": match_topic,
        "match_difficulty": match_difficulty
    }


def remove_request(request):
    if request in pending_requests:
        pending_requests.remove(request)


def consume_messages():
    print("Trying")
    time.sleep(30)
    print("Attempting connection")
    try:
        if os.getenv('ENV') == "PROD":
            credentials = pika.PlainCredentials(os.getenv('RABBITMQ_USER'), 
                                                os.getenv('RABBITMQ_PASSWORD'))
            parameters = pika.ConnectionParameters(host=RABBITMQ_HOST, 
                                                   virtual_host=os.getenv('RABBITMQ_VHOST'), 
                                                   credentials=credentials, 
                                                   ssl_options=pika.SSLOptions(ssl_context))
            connection = pika.BlockingConnection(parameters)
        else:
            credentials = pika.PlainCredentials('peerprep', 'peerprep')
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(host=RABBITMQ_HOST, credentials=credentials))
        print("connection ready")

        channel = connection.channel()
        channel.queue_declare(queue='match_queue')

        def callback(ch, method, properties, body):
            print(f" [x] Received {body}", file=sys.stderr)
            request = json.loads(body)
            match_user(request)
        channel.basic_consume(queue='match_queue', on_message_callback=callback, auto_ack=True)

        print(' [*] Waiting for messages. To exit press CTRL+C')
        channel.start_consuming()
    except Exception as e:
        print("Failed: " + str(e), file=sys.stderr)
        traceback.print_exc()


@sio.event
def connect():
    print("Connected to notification service")

@sio.event
def disconnect():
    print("Disconnected from notification service")

@app.get('/')
def home():
    return f"Server is running on port {PORT}"

@app.route('/enqueue', methods=['OPTIONS'])
def handle_options():
    response = jsonify({})
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, DELETE, PUT, PATCH"
    return response, 200

@app.route('/enqueue', methods=['POST'])
def queue():
    data = json.dumps(request.get_json())
    produce_message(data)

    return jsonify({"status": "Enqueue request sent to RabbitMQ", "message": data}), 200

@app.route('/dequeue', methods=['POST'])
def dequeue():
    data = json.dumps(request.get_json())
    produce_message(data)

    return jsonify({"status": "Dequeue request sent to RabbitMQ", "message": data}), 200

if __name__ == '__main__':
    print(f"Running on port {PORT}")
    
    while True:
        try:
            print(f"Attempting to connect to notification service at {NOTIFICATION_SERVICE}")
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
