from datetime import datetime
from typing import Any
from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi_jwt_auth import AuthJWT
from sqlalchemy.orm import Session
from app_v2 import crud, schemas
from app_v2.dependencies import get_session

app = APIRouter(
    prefix="/misc",
    tags=['misc'],
)

@app.get('/curve/', response_model=dict[float,dict])
async def get_curve(
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    # Authorize.jwt_required()

    curve = await crud.get_curve(session)
    return curve

@app.get('/curve/history', response_model=list[schemas.GcurveHistory])
async def get_curve_history(
    from_date: str,
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    # Authorize.jwt_required()

    from_date = datetime.datetime.strptime(from_date, '%Y-%m-%d').date()

    curve = await crud.get_curve_history(session, from_date=from_date)

    return curve

@app.get("/features/", response_model=list[schemas.Feature])
async def get_features(
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    # Authorize.jwt_required()
    # current_user = Authorize.get_jwt_subject()

    features = await crud.get_features(session)
    return features

@app.post("/features/", response_model=list[schemas.Feature])
async def create_feature(
    feature: schemas.FeatureCreate,
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    Authorize.jwt_required()

    user_id = Authorize.get_jwt_subject()
    user = await crud.get_user_by_id(session, user_id)

    if user.role == 3:
        await crud.create_feature(session, feature_text=feature.text)
        return True
    return False


@app.post('/version')
async def version():
    return '2.0.0'