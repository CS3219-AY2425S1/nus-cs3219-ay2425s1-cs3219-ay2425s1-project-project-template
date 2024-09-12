from fastapi import APIRouter

from .ping import router as PingRouter

main_router = APIRouter()

main_router.include_router(PingRouter, tags=["default"])


@main_router.get("/")
async def index():
    return {"message": "Hello from Question Service"}
