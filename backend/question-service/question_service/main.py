from fastapi import FastAPI, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from structlog import get_logger

from .api import main_router
from .config import settings
from .schemas import CustomValidationErrorResponse
from .service.question_service import init_db

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errs = {
        "errors": [
            {
                "loc": err["loc"][1],
                "msg": err["msg"],
            }
            for err in exc.errors()
        ]
    }
    err_model = CustomValidationErrorResponse(**errs)
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder(err_model),
    )


logger = get_logger()
app = FastAPI(
    title="Question Service Backend",
    exception_handlers={RequestValidationError: validation_exception_handler},
    responses={
        status.HTTP_422_UNPROCESSABLE_ENTITY: {
            "description": "Validation Error",
            "model": CustomValidationErrorResponse,
        }
    },
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    # To update if after auth
    allow_headers=["*"],
)
app.include_router(main_router)

@app.on_event("startup")
async def start_db():
    await init_db()

logger.info("📚 Question service started")
