FROM python:3.12-slim AS setup
WORKDIR /app
COPY requirements.txt .
RUN python -m venv .venv
RUN .venv/bin/pip install --no-cache-dir -r requirements.txt
COPY . .

FROM setup AS dev
CMD ["sh", "-c", ".venv/bin/fastapi dev app/main.py --port ${PORT}"]

FROM setup AS prod
CMD ["sh", "-c", ".venv/bin/fastapi run app/main.py --port ${PORT}"]
