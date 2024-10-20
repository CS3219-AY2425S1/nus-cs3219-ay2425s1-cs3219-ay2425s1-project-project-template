from flask import Flask
import os
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
CORS(app)

PORT = int(os.environ.get('PORT', 5000))

@app.get('/')
def home():
    return f"Server is running on port {PORT}"

from sockets import *

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=PORT, debug=True)
