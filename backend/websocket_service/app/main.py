from fastapi import FastAPI, WebSocket, Request, HTTPException, status
from .kafka_consumer import kafka_consumer, redis_client
import asyncio
import logging
import json
import time
from pydantic import BaseModel

# Set up the logger
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger = logging.getLogger(__name__)

app = FastAPI()


class CancelRequest(BaseModel):
    user_id: str


class CanQueueRequest(BaseModel):
    user_id: str
    request_time: float


class CanProceedRequest(BaseModel):
    user1_id: str
    user2_id: str


connected_clients = {}


async def send_with_retries(user_id, message, max_retries=4, delay=0.5, timeout=30):
    """Attempts to send the message with retry logic within the 30-second window."""
    retries = 0
    start_time = time.time()

    while retries < max_retries and (time.time() - start_time) < timeout:
        if user_id in connected_clients:
            try:
                await connected_clients[user_id].send_text(json.dumps(message))
                logger.info(f"Sent match result to user {user_id}: {message}")
                return
            except Exception as e:
                logger.error(f"Error sending match result to user {user_id}: {str(e)}")

        await asyncio.sleep(delay * (2**retries))
        retries += 1

    logger.warning(
        f"Failed to send match result to user {user_id} after {max_retries} retries or {timeout} seconds"
    )


@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await websocket.accept()
    connected_clients[user_id] = websocket
    logger.info(f"User {user_id} connected.")
    try:
        while True:
            data = await websocket.receive_text()
            logger.info(f"Received message from user {user_id}: {data}")
    except Exception as e:
        logger.error(f"Error with WebSocket connection: {e}")
    finally:
        connected_clients.pop(user_id, None)
        logger.info(f"User {user_id} disconnected.")


async def match_result_dispatcher():
    async for match_result in kafka_consumer():
        logger.info("Fetched from Kafka topic", match_result)
        logger.info(f"curent connected clients: {connected_clients}")
        user1_id = match_result.get("user1_id")
        user2_id = match_result.get("user2_id")
        if user1_id in connected_clients:
            await send_with_retries(user1_id, match_result, max_retries=4)
        else:
            logger.info(f"User {user1_id} is not connected. Cannot send match result.")

        if user2_id in connected_clients:
            await send_with_retries(user2_id, match_result, max_retries=4)
        else:
            logger.info(f"User {user2_id} is not connected. Cannot send match result.")


@app.on_event("startup")
async def startup_event():
    logger.info("Starting match result dispatcher")
    asyncio.create_task(match_result_dispatcher())
    logger.info("Match result dispatcher started successfully")


@app.post("/cancel")
async def cancel_request(cancel_request: CancelRequest):
    """
    Cancel a match request and update the state.
    """
    user_id = cancel_request.user_id

    try:
        redis_client.hset(f"user:{user_id}", "state", "cancelled")
        logger.info(f"Cancellation requested for user_id: {user_id}")
        return {"status": "cancellation_requested"}, status.HTTP_200_OK
    except Exception as e:
        logger.info(f"Error handling cancellation: {e}")
        return {"status": "error", "message": str(e)}


@app.post("/can-queue")
async def can_queue(can_queue_request: CanQueueRequest):
    """
    Check if the request can be added to RabbitMQ based on request time
    and if the state is still 'matching'. Return true if allowed, otherwise false.
    """
    user_id = can_queue_request.user_id
    request_time = can_queue_request.request_time

    previous_request_time = redis_client.hget(f"user:{user_id}", "request_time")
    state = redis_client.hget(f"user:{user_id}", "state")

    if not state:
        return {"can_add_to_queue": True}

    state = state.decode("utf-8")
    logger.info(f"State for user {user_id}: {state}")

    if not previous_request_time:
        return {"can_add_to_queue": True}

    try:
        diff = float(request_time) - float(previous_request_time.decode("utf-8"))
    except (ValueError, AttributeError) as e:
        logger.error(f"Error decoding previous request time for user {user_id}: {e}")
        return {"can_add_to_queue": True}

    if diff >= 30 or state in ["qn_assigned", "canceled"]:
        return {"can_add_to_queue": True}

    if state == "matching":
        return {"can_add_to_queue": False}

    logger.warning(f"Unexpected state {state} for user {user_id}. Allowing queue.")
    return {"can_add_to_queue": True}


@app.post("/can-proceed")
async def can_proceed(can_proceed_request: CanProceedRequest):
    """
    Check if two users can proceed with a match based on their states.
    """
    user1_id = can_proceed_request.user1_id
    user2_id = can_proceed_request.user2_id

    user1_state = redis_client.hget(f"user:{user1_id}", "state")
    user2_state = redis_client.hget(f"user:{user2_id}", "state")

    if user1_state != b"cancelled" and user2_state != b"cancelled":
        return {"can_proceed": True}

    cancelled_users = []
    if user1_state == b"cancelled":
        cancelled_users.append(user1_id)
    if user2_state == b"cancelled":
        cancelled_users.append(user2_id)

    return {"can_proceed": False, "cancelled_users": cancelled_users}


def handle_cancellation(user_id, req_id):
    """
    Handle the cancellation logic.
    """
