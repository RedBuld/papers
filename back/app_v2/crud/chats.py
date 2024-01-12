from datetime import datetime
from typing import Any
from sqlalchemy import func, select, update, exists, or_, and_
from sqlalchemy.orm import aliased
from sqlalchemy.orm import sessionmaker
from app_v2 import models
from app_v2 import schemas

async def get_chats(
    session_maker: sessionmaker
) -> list[models.Chat]:
    
    result = []
    select_statement = \
        select(models.Chat)\
        .order_by(
            models.Chat.updated.desc()
        )

    with session_maker() as session:
        select_query = session.execute(select_statement)
        result = select_query.scalars().all()
        session.close()

    return result

async def get_chat_messages(
    session_maker: sessionmaker,
    chat_id: int,
    user: models.User
) -> list[models.ChatMessage]:
    
    update_statement = \
        update(models.Chat)\
        .where(
            models.Chat.id == chat_id
        )

    select_statement = \
        select(models.ChatMessage)\
        .filter(
            models.ChatMessage.chat_id == chat_id
        )\
        .order_by(
            models.ChatMessage.created.asc()
        )

    if user.role == 3:
        update_statement = update_statement\
            .values({
                models.Chat.unread_admin: False
            })
    else:
        update_statement = update_statement\
            .values({
                models.Chat.unread_owner: False
            })

    with session_maker() as session:
        update_query = session.execute(update_statement)
        select_query = session.execute(select_statement)
        result = select_query.scalars().all()
        session.commit()
        session.close()

    return result

async def new_chat_message(
    session_maker: sessionmaker,
    chat_id: int,
    user: models.User,
    message_text: str
) -> bool:
    
    chat = None
    
    select_statement = \
        select(models.Chat)\
        .filter(models.Chat.id == chat_id)
    
    with session_maker() as session:
        select_query = session.execute(select_statement)
        chat = select_query.scalars().one_or_none()
        if not chat:
            chat = models.Chat(id=chat_id)
            session.add(chat)
            session.commit()
            session.refresh(chat)
        session.close()


    chat_msg = models.ChatMessage()
    chat_msg.message = message_text
    chat_msg.chat_id = chat_id
    chat_msg.user_id = user.id
    chat_msg.created = datetime.now()

    chat.updated = chat_msg.created
    if user.role == 3:
        chat.unread_owner = True
    else:
        chat.unread_admin = True

    with session_maker() as session:
        session.add(chat)
        session.add(chat_msg)
        session.commit()
        session.close()

    return True