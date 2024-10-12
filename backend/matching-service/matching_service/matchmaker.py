import json
import time

from redis import Redis

from .common import MatchRequest
from .config import RedisSettings

test_client = Redis()


class Matchmaker:
    def __init__(self, chan: RedisSettings.Channels):
        self.channel: str = chan
        self.client: Redis = Redis.from_url(RedisSettings.redis_url(chan))
        self.pubsub = self.client.pubsub()

    def run(self):
        self.pubsub.subscribe(self.channel)

        while True:
            message = self.pubsub.get_message()
            if message and message["type"] == "message":
                user_data = json.loads(message["data"])
                user_id = user_data["user_id"]
                print(f"💬 Received matchmaking request from User {user_id} for {self.channel}")

                unmatched_key = f"unmatched_{self.channel}"
                unmatched_users = self.client.lrange(unmatched_key, 0, -1)

                if unmatched_users:
                    other_user = self.client.lpop(unmatched_key).decode("utf-8")
                    print(f"✅ Matched Users: {user_id} and {other_user} for {self.channel}!")
                else:
                    self.client.rpush(unmatched_key, user_id)
                    print(f"⏳ User {user_id} added to the unmatched pool for {self.channel}")
            time.sleep(0.1)


def request_match(user: MatchRequest):
    channel = user.difficulty
    message = json.dumps({"user_id": user.user, "difficulty": user.difficulty})
    test_client.publish(channel, message)
    print(f"User {user.user_id} requested match on {channel}")


if __name__ == "__main__":
    easy = Matchmaker(RedisSettings.Channels.EASY)
    med = Matchmaker(RedisSettings.Channels.MED)

    user1 = MatchRequest(user="user1", difficulty="Easy", topic="test")()
    user2 = MatchRequest(user="user2", difficulty="Easy", topic="test")
    user3 = MatchRequest(user="user3", difficulty="Hard", topic="test")

    from threading import Thread

    easy_thread = Thread(target=easy.run, args=())
    medium_thread = Thread(target=med.run, args=())
    easy_thread.start()
    medium_thread.start()

    time.sleep(1)  # Give time for the service to start
    request_match(user1)
    time.sleep(2)
    request_match(user2)
    time.sleep(2)
    request_match(user3)
