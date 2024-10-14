# app/config.py
import os


class Config:
    REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")
    KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BROKER", "broker:9092")
    DEBUG = False


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False
