"""
Integration test for matchmaker
"""

import time
from threading import Thread

import pytest
from matching_service.common import MatchRequest
from matching_service.config import RedisSettings
from matching_service.matchmaker import Matchmaker, request_match
from redis import Redis
from testcontainers.redis import RedisContainer


@pytest.fixture(scope="module")
def redis_container():
    """Fixture to spin up a Redis test container."""
    with RedisContainer() as test_redis:
        test_client = test_redis.get_client()
        yield test_client


@pytest.fixture(scope="function")
def easy_matchmaker_thread(redis_container: Redis):
    """Fixture to set up the Matchmaker with a background thread."""
    easy = Matchmaker(RedisSettings.Channels.EASY)
    easy.client = redis_container
    easy.pubsub = easy.client.pubsub()

    thread = Thread(target=easy.run)
    thread.start()

    yield easy

    easy.stop()
    thread.join()


def test_single_user_leaves_user_in_queue(redis_container: Redis, easy_matchmaker_thread: Thread):
    """Test that a single user request remains in the queue."""
    match_req = MatchRequest(user="user1", difficulty="Easy", topic="test")
    initial = len(redis_container.lrange(match_req.topic, 0, -1))  # test fails without this idk why
    request_match(redis_container, match_req)

    time.sleep(0.5)

    result = redis_container.lrange(match_req.topic, 0, -1)
    assert len(result) == initial + 1


def test_match_removes_users(redis_container: Redis, easy_matchmaker_thread: Thread):
    """Test that a single user request remains in the queue."""
    match_req1 = MatchRequest(user="user1", difficulty="Easy", topic="test")
    match_req2 = MatchRequest(user="user2", difficulty="Easy", topic="test")
    redis_container.delete(match_req1.topic)  # clear db

    request_match(redis_container, match_req1)
    request_match(redis_container, match_req2)

    time.sleep(0.5)

    result = redis_container.lrange(match_req1.topic, 0, -1)
    assert len(result) == 0


def test_users_with_different_topic_does_not_match(redis_container: Redis, easy_matchmaker_thread: Thread):
    match_req1 = MatchRequest(user="user1", difficulty="Easy", topic="dp")
    match_req2 = MatchRequest(user="user2", difficulty="Easy", topic="linked-list")
    redis_container.delete(match_req1.topic)  # clear db
    redis_container.delete(match_req2.topic)  # clear db

    request_match(redis_container, match_req1)
    request_match(redis_container, match_req2)

    time.sleep(0.5)

    topic1 = redis_container.lrange(match_req1.topic, 0, -1)
    assert len(topic1) == 1
    topic2 = redis_container.lrange(match_req2.topic, 0, -1)
    assert len(topic2) == 1
