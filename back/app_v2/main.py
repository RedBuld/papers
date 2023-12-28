from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.exceptions import ResponseValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
# from fastapi_cache import FastAPICache
# from fastapi_cache.backends.redis import RedisBackend
# from fastapi_cache.decorator import cache
# from redis import asyncio as aioredis
from app_v2 import schemas
from app_v2.routers import BorrowesRequests
from app_v2.routers import BondsRequests
from app_v2.routers import FoldersRequests
from app_v2.routers import UpdatesRequests
from app_v2.routers import ChatsRequests
from app_v2.routers import AuthRequests
from app_v2.routers import MiscRequests
from app_v2.dependencies import update_db

@AuthJWT.load_config
def get_config():
    return schemas.JWTSettings()

async def authjwt_exception_handler(request: Request, exc: AuthJWTException):
    return JSONResponse(
        status_code=401,
        content={"detail": str(exc) }
    )

async def request_validation_error_exception_handler(request: Request, exc: RequestValidationError):
    print(exc)
    validation_errors = exc.errors()
    return JSONResponse(
        status_code=500,
        content={"detail": [str(err) for err in validation_errors]}
    )

async def response_validation_error_exception_handler(request: Request, exc: ResponseValidationError):
    print(exc)
    validation_errors = exc.errors()
    return JSONResponse(
        status_code=500,
        content={"detail": [str(err) for err in validation_errors]}
    )

async def base_error_exception_handler(request: Request, exc: Exception):
    print(exc)
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)}
    )

@asynccontextmanager
async def lifespan( app: FastAPI ):
    update_db()
    yield

app = FastAPI(
    exception_handlers={
        AuthJWTException: authjwt_exception_handler,
        RequestValidationError: request_validation_error_exception_handler,
        ResponseValidationError: response_validation_error_exception_handler,
        Exception: base_error_exception_handler
    },
    lifespan=lifespan
)

# @app.on_event("startup")
# async def startup():
#     redis = aioredis.from_url("redis://localhost",  db=12)
#     FastAPICache.init(RedisBackend(redis), prefix="papers-cache")

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(BorrowesRequests)
app.include_router(BondsRequests)
app.include_router(FoldersRequests)
app.include_router(UpdatesRequests)
app.include_router(ChatsRequests)
app.include_router(AuthRequests)
app.include_router(MiscRequests)