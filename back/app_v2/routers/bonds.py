from typing import Any
from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi_jwt_auth import AuthJWT
from sqlalchemy.orm import Session
from app_v2 import crud, schemas
from app_v2.dependencies import get_session

app = APIRouter(
    prefix="/bonds",
    tags=['bonds'],
)

@app.post("/", response_model=schemas.BondsCountedResult)
async def get_bonds(
    request: Request,
    page: int = 1,
    page_size: int = 20,
    order: str | None = "asc",
    order_by: str | None = "id",
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    # Authorize.jwt_required()

    if page and page < 1:
        page = 1

    filters = await request.json()

    bonds, total = await crud.get_bonds(session, page=page, page_size=page_size, order_by=order_by, order=order, filters=filters)
    return {'results':bonds, 'total':total, 'page':page}

@app.get("/id/{bond_id}", response_model=schemas.Bond)
async def get_bond(
    bond_id: int,
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    # Authorize.jwt_required()

    bond = await crud.get_bond_by_id(session, bond_id)
    if bond is None:
        raise HTTPException(status_code=404, detail="Bond not found")
    return bond

# @app.get("/isin/{isin}", response_model=schemas.Bond)
# async def get_bond_by_isin(
#     isin: str = "",
#     session: Session = Depends(get_session),
#     Authorize: AuthJWT = Depends()
# ):
#     # Authorize.jwt_required()

#     bond = await crud.get_bond_by_isin(session, isin)
#     if bond is None:
#         raise HTTPException(status_code=404, detail="Bond not found")
#     return bond

@app.get("/top", response_model=list[schemas.TopBondsResult])
async def get_top_bonds(
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    Authorize.jwt_required()

    top = await crud.get_bonds_by_top3_folders(session)
    return top

@app.post("/coming", response_model=schemas.UpcomingBondsCountedResult)
async def get_coming_bonds(
    page: int = 1,
    page_size: int = 20,
    order_by: str | None = "id",
    order: str | None = "asc",
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends(),
):
    Authorize.jwt_required()

    bonds, total = await crud.get_coming_bonds(session, page=page, page_size=page_size, order_by=order_by, order=order)
    return {'results':bonds, 'total':total, 'page':page}

@app.get("/check/fresh")
async def check_fresh_bonds(
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    Authorize.jwt_required()

    total = await crud.has_fresh_bonds(session)
    return {'total':total}

@app.get("/check/coming")
async def check_coming_bonds(
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    Authorize.jwt_required()

    total = await crud.has_coming_bonds(session)
    return {'total':total}

@app.get("/filters")
async def get_bonds_filters(
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    # Authorize.jwt_required()

    filters = {
        'loose_ratings': {
            'label': 'Рейтинги ИЛИ',
            'mode': 'bool',
            'values': True,
        },
        'yields': {
            'mode': 'range',
            'options': {'min':'','max':'','mode':'range'}
        },
        'bonus': {
            'mode': 'range',
            'options': {'min':'','max':'','mode':'range'}
        },
        'bonus_dur': {
            'mode': 'range',
            'options': {'min':'','max':'','mode':'range'}
        }
    }

    ratings_data = await crud.get_filters_bonds_ratings(session)
    if ratings_data:
        for agency in ratings_data:
            if ratings_data[agency]:
                filters['rating_'+agency] = {
                    'mode': 'select',
                    'options': ratings_data[agency],
                }

    statuses_data = await crud.get_filters_bonds_statuses(session)
    if statuses_data:
        filters['status'] = {
            'mode': 'select',
            'options': statuses_data,
            'values': ['В обращении'],
        }
    
    attributes_data = await crud.get_filters_bonds_attributes(session)

    filters = {**filters,**attributes_data}

    return filters