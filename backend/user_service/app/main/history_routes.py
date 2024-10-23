from flask import Blueprint, request, jsonify
from app.auth_api.helper import verify_token

history = Blueprint('attempt_history', __name__)

match_history = []  # Will be stored in firebase

@history.route("/history", methods=["POST"])
def record_attempt():
    try:
        match_data = request.json

    except Exception as e:
        return jsonify({"error": "Failed to record match", 
                        "details": str(e)}), 500
    
@history.route("/<uid>/history", methods=["GET"])
def get_user_history(uid):
    decoded_token, error, status_code = verify_token()

    if error:
        return jsonify({"error": error}), status_code
    
    if decoded_token["user_id"] != uid:
        return jsonify({
            "error": "You are not authorized to view this user's history"
            }), 403
    
    # Fetch User's History

