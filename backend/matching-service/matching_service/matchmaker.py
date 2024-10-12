import json
import time
from threading import Event, Thread

from redis import Redis
from structlog import get_logger

from matching_service.common import MatchRequest
from matching_service.config import RedisSettings

logger = get_logger()


class Matchmaker:
    def __init__(self, chan: RedisSettings.Channels):
        self.channel: str = chan.value
        self.client: Redis = Redis.from_url(RedisSettings.redis_url(chan))
        logger.info(f"{self.channel} connected to {self.client.get_connection_kwargs()}")
        self.pubsub = self.client.pubsub()
        self.stop_event = Event()

    def run(self):
        self.pubsub.subscribe(self.channel)
        while not self.stop_event.is_set():
            message = self.pubsub.get_message()
            if message and message["type"] == "message":
                user_data = json.loads(message["data"])
                user_id = user_data["user"]
                logger.info(f"💬 Received matchmaking request from User {user_id} for {self.channel}")
                unmatched_key = f"{user_data["topic"]}"
                unmatched_users = self.client.lrange(unmatched_key, 0, -1)
                if unmatched_users:
                    other_user = self.client.lpop(unmatched_key).decode("utf-8")
                    logger.info(f"✅ Matched Users: {user_id} and {other_user} for {self.channel}, {unmatched_key}!")
                else:
                    self.client.rpush(unmatched_key, user_id)
                    logger.info(f"⏳ User {user_id} added to the unmatched pool for {self.channel}, {unmatched_key}")
            time.sleep(0.1)

    def stop(self):
        self.stop_event.set()
        self.pubsub.unsubscribe()
        self.pubsub.close()
        self.client.close()


def request_match(client: Redis, user: MatchRequest):
    channel = user.difficulty.value
    message = json.dumps({"user": user.user, "difficulty": user.difficulty.value, "topic": user.topic})
    client.publish(channel, message)
    logger.info(f"Client: User {user.user} requested match on {channel}")


if __name__ == "__main__":
    logger.info("🤖 Matchmaker started!")
    workers = [
        Matchmaker(RedisSettings.Channels.EASY),
        Matchmaker(RedisSettings.Channels.MED),
        Matchmaker(RedisSettings.Channels.HARD),
    ]

    for worker in workers:
        thread = Thread(target=worker.run)
        thread.start()
        logger.info(f"🌱 {worker.channel} worker started")
