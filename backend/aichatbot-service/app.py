from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import requests

PORT = int(os.environ.get('PORT', 5003))

load_dotenv()
app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={API_KEY}"


@app.route("/chatbot", methods=["POST"])
def chatbot():
    user_message = request.json.get("message")
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    # Set up API request payload and headers
    payload = {
        "contents": [
            {"parts": [{"text": user_message}]}
        ]
    }
    headers = { "Content-Type": "application/json" }

    # Send the request to Gemini API
    try:
        response = requests.post(GEMINI_ENDPOINT, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()
        print("Full Gemini API Reponse:", data)

        if 'candidates' in data and 'content' in data['candidates'][0]:
            chatbot_response = data['candidates'][0]['content']['parts'][0]['text']
        else:
            chatbot_response = "No content available."
        return jsonify({"response": chatbot_response})

    except requests.exceptions.RequestException as e:
        print(f"Error communicating with Gemini API: {e}")
        return jsonify({"error": "Failed to connect to Gemini API"}), 500


if __name__ == "__main__":
    app.run(host='0.0.0.0', port = PORT, debug=True)