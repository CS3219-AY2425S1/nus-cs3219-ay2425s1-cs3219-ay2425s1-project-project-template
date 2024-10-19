from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pika
from dotenv import load_dotenv
import json
import sys
import threading

load_dotenv()
app = Flask(__name__)
CORS(app)

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

pending_requests = [{"topic": "Arrays", "difficulty": "Easy", "username": "tester1"}]

def match_user(request):
    topic, difficulty = request['topic'], request['difficulty']
    # Check for a match in the pending_requests
    for pending in pending_requests:
        if pending['topic'] == topic and pending['difficulty'] == difficulty:
            # Match found
            notify_users(pending, request, message="Matched difficulty and topic")
            pending_requests.remove(pending)
            return
        elif pending['topic'] == topic:
            # Partial match
            notify_users(pending, request, message="Matched topic")
            pending_requests.remove(pending)
            return
        elif pending['difficulty'] == difficulty:
            # Partial match
            notify_users(pending, request, message="Matched difficulty")
            pending_requests.remove(pending)
            return
    # No match found, add the request to pending_requests
    pending_requests.append(request)

    # Set a timer to remove the request after 60 seconds if no match is found
    threading.Timer(60.0, remove_request, [request]).start()

def remove_request(request):
    if request in pending_requests:
        pending_requests.remove(request)


def notify_users(user1, user2, message):
    # TODO: Replace print statements with actual notification logic
    if message == "Matched difficulty and topic":
        print(f"Matched {user1['username']} and {user2['username']} with topic {user1['topic']} and difficulty {user1['difficulty']}")
    elif message == "Matched topic":
        print(f"Matched {user1['username']} and {user2['username']} with topic {user1['topic']}")
    elif message == "Matched difficulty":
        print(f"Matched {user1['username']} and {user2['username']} with difficulty {user1['difficulty']}")
    else:
        print("No users matched")
    pass


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
    app.run(host='0.0.0.0', port=PORT, debug=True)
    consume_messages()
