import json
import time
from threading import Event, Thread

from pydantic import ValidationError
from redis import Redis
from structlog import get_logger

from matching_service.common import MatchRequest
from matching_service.config import RedisSettings

logger = get_logger()


class Matchmaker:
    def __init__(self):
        self.channel = RedisSettings.Channels.REQUESTS
        self.client: Redis = Redis.from_url(RedisSettings.redis_url(self.channel))

        self.pubsub = self.client.pubsub()

        self.stop_event = Event()
        logger.info(f"MATCHMAKER: connected to {self.client.get_connection_kwargs()}")

    def run(self):
        self.pubsub.subscribe(self.channel.value)
        while not self.stop_event.is_set():
            message = self.pubsub.get_message()
            if message and message["type"] == "message":
                logger.info("MATCHMAKER: Received match request")
                user_data = json.loads(message["data"])

                try:
                    req = MatchRequest(**user_data)
                except ValidationError as e:
                    logger.warn(f"\tUnrecognised request format discarded: {e}")
                    continue

                logger.info(f"\t💬 Received matchmaking request from User {req.user} for {req.get_key()}")

                unmatched_key = req.get_key()
                unmatched_users = self.client.lrange(unmatched_key, 0, -1)

                if unmatched_users:
                    other_user = self.client.lpop(unmatched_key).decode("utf-8")
                    logger.info(f"\t✅ Matched Users: {req.user} and {other_user} for {unmatched_key}!")
                else:
                    self.client.rpush(unmatched_key, req.user)
                    logger.info(f"\t⏳ User {req.user} added to the unmatched pool for {unmatched_key}")
            time.sleep(0.1)

    def stop(self):
        self.stop_event.set()
        self.pubsub.unsubscribe()
        self.pubsub.close()
        self.client.close()


def request_match(publisher: Redis, user: MatchRequest):
    channel = RedisSettings.Channels.REQUESTS.value
    message = json.dumps({"user": user.user, "difficulty": user.difficulty.value, "topic": user.topic})
    publisher.publish(channel, message)
    logger.info(f"CLIENT: User {user.user} requested match for {user.topic}, {user.difficulty}")


if __name__ == "__main__":
    logger.info("🤖 Matchmaker started!")
    matchmaker = Matchmaker()
    thread = Thread(target=matchmaker.run)
    thread.start()
