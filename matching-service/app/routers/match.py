from fastapi import APIRouter

router = APIRouter()

# Make a dummy endpoint to test the connection
@router.get("/")
async def test_connection():
    return {"message": "Connection successful"}