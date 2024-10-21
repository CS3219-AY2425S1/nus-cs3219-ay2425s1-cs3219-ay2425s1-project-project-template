#!/bin/sh
if [ "$FLASK_ENV" = "development" ]; then
    exec python run.py
else
    exec waitress-serve --port=5001 run:app
fi