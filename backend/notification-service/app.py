from flask import Flask
from flask_socketio import SocketIO
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')

socketio = SocketIO(app)
PORT = int(os.environ.get('PORT', 5000))

@app.get('/')
def home():
    return f"Server is running on port {PORT}"

if __name__ == '__main__':
    socketio.run(app, port=PORT, debug=True)
