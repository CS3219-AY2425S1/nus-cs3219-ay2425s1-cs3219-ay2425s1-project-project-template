from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pika
from dotenv import load_dotenv
import json
import sys

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
        # Declare a queue named 'match_queue'
        channel.queue_declare(queue='match_queue')
        # Publish the message to the queue
        channel.basic_publish(exchange='',
                            routing_key='match_queue',
                            body=message)
        
        print(f" [x] Sent '{message}'")
        connection.close()
    except Exception as e:
        print("Failed: " + str(e), file=sys.stderr)

    # Close the connection
    

@app.get('/')
def home():
    return f"Server is running on port {PORT}"

@app.route('/match', methods=['POST'])
def queue():
    data = json.dumps(request.get_json())
    produce_message(data)

    return jsonify({"status": "Message sent to RabbitMQ", "message": data}), 200

if __name__ == '__main__':
    print(f"Running on port {PORT}")
    app.run(host='0.0.0.0', port=PORT, debug=True)
