from datetime import datetime
from typing import Any
from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi_jwt_auth import AuthJWT
from sqlalchemy.orm import Session
from app_v2 import crud, schemas
from app_v2.dependencies import get_session

app = APIRouter(
    prefix="/updates",
    tags=['updates'],
)

@app.get("/history")
async def get_history_updates(
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    Authorize.jwt_required()

    last = await crud.get_last_borrowers_ratings_history_id(session)

    return last

@app.get("/features")
async def get_features_updates(
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    Authorize.jwt_required()

    last = await crud.get_last_feature(session)

    return last

@app.get("/chats")
async def get_chats_updates(
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    Authorize.jwt_required()

    user_id = Authorize.get_jwt_subject()
    user = await crud.get_user_by_id(session, user_id)

    if user.role == 3:
        count = await crud.count_unread_chats(session)
    else:
        count = await crud.count_unread_chats(session, user_id=user.id)
    return count