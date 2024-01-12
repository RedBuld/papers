from datetime import datetime
from typing import Any
from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi_jwt_auth import AuthJWT
from sqlalchemy.orm import Session
from app_v2 import crud, schemas
from app_v2.dependencies import get_session

app = APIRouter(
    prefix="/chats",
    tags=['chats'],
)

@app.get("/", response_model=list[schemas.Chat])
async def get_chats(
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    Authorize.jwt_required()

    user_id = Authorize.get_jwt_subject()
    user = await crud.get_user_by_id(session, user_id)

    if user.role == 3:
        chats = await crud.get_chats(session)
    else:
        chats = []
    return chats

@app.get("/{chat_id}", response_model=schemas.Chat|None)
async def get_chat(
    chat_id: int,
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    Authorize.jwt_required()

    user_id = Authorize.get_jwt_subject()
    user = await crud.get_user_by_id(session, user_id)

    if user.role == 3 or user.id == chat_id:
        chat = await crud.get_chat(session, chat_id=chat_id, user=user)
    else:
        raise HTTPException(status_code=403, detail="Нет доступа")
    return chat

@app.get("/{chat_id}/messages", response_model=list[schemas.ChatMessage])
async def get_chat_messages(
    chat_id: int,
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    Authorize.jwt_required()

    user_id = Authorize.get_jwt_subject()
    user = await crud.get_user_by_id(session, user_id)

    if user.role == 3 or user.id == chat_id:
        messages = await crud.get_chat_messages(session, chat_id=chat_id, user=user)
    else:
        raise HTTPException(status_code=403, detail="Нет доступа")
    return messages

@app.post("/{chat_id}/messages", response_model=list[schemas.ChatMessage])
async def new_chat_message(
    chat_id: int,
    msg: schemas.ChatNewMessage,
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    Authorize.jwt_required()

    user_id = Authorize.get_jwt_subject()
    user = await crud.get_user_by_id(session, user_id)

    if user.role == 3 or user.id == chat_id:
        await crud.new_chat_message(session, chat_id=chat_id, user=user, message_text=msg.message)
        return await crud.get_chat_messages(session, chat_id=chat_id, user=user)
    else:
        raise HTTPException(status_code=403, detail="Нет доступа к чату")