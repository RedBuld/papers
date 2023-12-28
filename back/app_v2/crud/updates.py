import math
from typing import Any
from sqlalchemy import func, distinct, select, exists, or_, and_
from sqlalchemy.orm import aliased
from sqlalchemy.orm import sessionmaker
from app_v2 import models
from app_v2 import schemas

async def get_last_borrowers_ratings_history_id(
    session_maker: sessionmaker
) -> int | None:
    
    result = None
    ratings_statement = \
        select( models.BorrowerRatingHistory.id )\
        .order_by(
            models.BorrowerRatingHistory.date.desc(),
            models.BorrowerRatingHistory.id.desc()
        )\
        .limit(1)

    with session_maker() as session:
        ratings_query = session.execute(ratings_statement)
        result = ratings_query.scalars().one_or_none()
        
        session.close()

    return result

async def get_last_feature(
    session_maker: sessionmaker
) -> int | None:

    result = None
    feature_statement = \
        select( models.Feature.id )\
        .order_by(
            models.Feature.created_at.desc()
        )\
        .limit(1)

    with session_maker() as session:
        ratings_query = session.execute(feature_statement)
        result = ratings_query.scalars().one_or_none()
        
        session.close()

    return result


async def count_unread_chats(
    session_maker: sessionmaker,
    user_id: int | None = None
) -> int:
    
    result = 0
    count_statement = \
        select( func.count(models.Chat.id) )
    
    if not user_id:
        count_statement = count_statement\
            .filter(
                models.Chat.unread_admin==True
            )
    else:
        count_statement = count_statement\
            .filter(
                models.Chat.id==user_id,
                models.Chat.unread_owner==True
            )

    count_statement = count_statement\
        .limit(1)

    with session_maker() as session:
        ratings_query = session.execute(count_statement)
        result = ratings_query.scalar()
        
        session.close()

    return result