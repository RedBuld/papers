from argon2 import PasswordHasher
from sqlalchemy import func, select, exists, or_, and_
from sqlalchemy.orm import sessionmaker
from app_v2 import models
from app_v2 import schemas
from app_v2.dependencies import generateOTP

async def get_user_by_id(
    session_maker: sessionmaker,
    user_id: int
) -> models.User | None:

    result = None
    users_statement = \
        select(models.User)\
        .filter(models.User.id == user_id)

    with session_maker() as session:
        users_query = session.execute(users_statement)
        result = users_query.scalars().one_or_none()
        session.close()

    return result

async def get_user_by_email(
    session_maker: sessionmaker,
    user_email: str
) -> models.User | None:

    result = None
    users_statement = \
        select(models.User)\
        .filter(models.User.email == user_email)

    with session_maker() as session:
        users_query = session.execute(users_statement)
        result = users_query.scalars().one_or_none()
        session.close()

    return result

async def check_user_auth(
    session_maker: sessionmaker,
    user_email: str,
    user_password: str
) -> models.User | None:

    result = None
    users_statement = \
        select(models.User)\
        .filter(models.User.email == user_email)

    ph = PasswordHasher()

    with session_maker() as session:
        users_query = session.execute(users_statement)
        result = users_query.scalars().one_or_none()
        session.close()

    try:
        if ph.verify(result.hashed_password, user_password):
            return result
    except:
        return None

async def create_user(
    session_maker: sessionmaker,
    user_email: str,
    user_password: str
) -> models.User:
    
    ph = PasswordHasher()
    hashed_password = ph.hash( user_password.encode('utf8') )
    
    user = models.User( email=user_email, hashed_password=hashed_password, activation_code=generateOTP(), is_active=False )

    with session_maker() as session:
        session.add(user)
        session.commit()
        session.refresh(user)
        session.close()
    return user

async def activate_user(
    session_maker: sessionmaker,
    user_id: id,
    user_code: str
) -> models.User | None:

    user = await get_user_by_id(session_maker,user_id)

    if user and user.activation_code == user_code:
        user.activation_code = None
        user.is_active = True
        with session_maker() as session:
            session.add(user)
            session.commit()
            session.refresh(user)
            session.close()
        return user
    return None

async def forgot_password(
    session_maker: sessionmaker,
    user_email: str
) -> models.User | None:

    user = await get_user_by_email(session_maker,user_email)

    if user:
        user.activation_code=generateOTP()
        with session_maker() as session:
            session.add(user)
            session.commit()
            session.refresh(user)
            session.close()
        return user
    return None

async def reset_password(
    session_maker: sessionmaker,
    user_id: id,
    user_code: str,
    user_password: str,
) -> models.User | None:

    user = await get_user_by_id(session_maker,user_id)

    if user and user.activation_code == user_code:

        ph = PasswordHasher()
        hashed_password = ph.hash(user_password.encode('utf8'))

        user.activation_code = None
        user.hashed_password = hashed_password

        with session_maker() as session:
            session.add(user)
            session.commit()
            session.refresh(user)
            session.close()
        return user
    return None