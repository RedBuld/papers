from datetime import datetime
from typing import Any
from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi_jwt_auth import AuthJWT
from sqlalchemy.orm import Session
from app_v2 import crud, schemas
from app_v2.dependencies import get_session
from app_v2.emails import send_confirmation_email, send_reset_password_email

app = APIRouter(
    prefix="/auth",
    tags=['auth'],
)

@app.post('/login', response_model=schemas.LoginReponse)
async def login(
    user: schemas.UserAuth,
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    db_user = await crud.check_user_auth(session, user_email=user.email, user_password=user.password)

    if db_user:
        if db_user.is_active:
            access_token = Authorize.create_access_token(subject=db_user.id,user_claims={"role":db_user.role})
            refresh_token = Authorize.create_refresh_token(subject=db_user.id)
            return {"access_token": access_token, "refresh_token": refresh_token, "user": db_user}
        else:
            raise HTTPException(status_code=401,detail="Акканут не активирован")
    raise HTTPException(status_code=401,detail="Неправильные email или пароль")

@app.post('/refresh', response_model=schemas.LoginReponse)
async def refresh(
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    Authorize.jwt_refresh_token_required()

    user_id = Authorize.get_jwt_subject()

    if user_id:
        user = await crud.get_user_by_id(session, user_id=user_id)

        if user:
            new_access_token = Authorize.create_access_token(subject=user.id,user_claims={"role":user.role})
            new_refresh_token = Authorize.create_refresh_token(subject=user.id)
            return {"access_token": new_access_token, "refresh_token": new_refresh_token, "user": user}

    raise HTTPException(status_code=401,detail="Ошибка обновления токена")

@app.post("/registration", response_model=schemas.User)
async def create_user(
    user: schemas.UserAuth,
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    db_user = await crud.get_user_by_email(session, user_email=user.email)

    if db_user:
        if db_user.is_active or db_user.activation_code == None:
            raise HTTPException(status_code=400, detail="Email уже зарегистрирован")
        else:
            await send_confirmation_email(db_user)
            return db_user

    db_user = await crud.create_user(session, user_email=user.email, user_password=user.password)
    if not db_user:
        raise HTTPException(status_code=400, detail="Произошла ошибка")

    await confirmation_email(db_user)
    return db_user

@app.post("/confirmation", response_model=schemas.LoginReponse)
async def confirm_user(
    user: schemas.UserActivateAccount,
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    db_user = await crud.activate_user(session, user_id=user.id, user_code=user.code)

    if db_user:
        access_token = Authorize.create_access_token(subject=user.id)
        refresh_token = Authorize.create_refresh_token(subject=user.id)
        return {"access_token": access_token, "refresh_token": refresh_token, "user": db_user}
    raise HTTPException(status_code=401,detail="Неверный код")

@app.post("/forgot_password", response_model=schemas.LoginReponse)
async def forgot_password_user(
    user: schemas.UserForgotPassword,
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    db_user = await crud.forgot_password(session, user_email=user.email)

    if db_user:
        await send_reset_password_email(db_user)
        return {"access_token": '', "refresh_token": '', "user": db_user}
    raise HTTPException(status_code=400,detail="Произошла ошибка")

@app.post("/reset_password", response_model=schemas.LoginReponse)
async def reset_password_user(
    user: schemas.UserResetPassword,
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):

    db_user = await crud.reset_password(session, user_id=user.id, user_code=user.code, user_password=user.password)

    if db_user:
        access_token = Authorize.create_access_token(subject=db_user.id)
        refresh_token = Authorize.create_refresh_token(subject=db_user.id)
        return {"access_token": access_token, "refresh_token": refresh_token, "user": db_user}
    raise HTTPException(status_code=401,detail="Неверный код")