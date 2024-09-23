from fastapi import FastAPI

from app.routers import questions

app = FastAPI(title="Question Service API")

# Include routers
app.include_router(questions.router, prefix="/questions", tags=["questions"])
