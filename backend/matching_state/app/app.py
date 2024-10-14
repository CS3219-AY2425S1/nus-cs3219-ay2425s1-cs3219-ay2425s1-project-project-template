# app/app.py
from flask import Flask, request, jsonify
import os
from app.routes import bp as routes_bp
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    env = os.getenv("FLASK_ENV", "development")
    CORS(app)
    if env == "production":
        app.config.from_object("app.config.ProductionConfig")
    else:
        app.config.from_object("app.config.DevelopmentConfig")
    app.register_blueprint(routes_bp)

    return app
