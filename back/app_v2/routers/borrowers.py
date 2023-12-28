from typing import Any
from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi_jwt_auth import AuthJWT
from sqlalchemy.orm import Session
from app_v2 import crud, schemas
from app_v2.dependencies import get_session

app = APIRouter(
    prefix="/borrowers",
    tags=['borrowers'],
)

@app.post("/", response_model=schemas.BorrowersCountedResult)
async def read_borrowers(
    page: int = 1,
    page_size: int = 100,
    order_by: str | None = "id",
    order: str | None = "asc",
    filters: schemas.BorrowerFiltersRequest | None = {},
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    # Authorize.jwt_required()

    borrowers, total = await crud.get_borrowers(session, page=page, page_size=page_size, order_by=order_by, order=order, filters=filters)
    return {'results':borrowers, 'total':total, 'page':page}

@app.get("/filters", response_model=schemas.BorrowerFiltersResponse)
async def read_borrowers(
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    # Authorize.jwt_required()

    ratings = await crud.get_filters_rating_values(session)
    print(ratings)
    # forecasts = await crud.get_bonds_forecasts(db)
    # return {'ratings':ratings, 'forecasts':forecasts}
    return {'ratings':ratings}

@app.get("/id/{borrower_id}", response_model=schemas.BorrowerFull)
async def read_borrower_by_id(
    borrower_id: int,
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    # Authorize.jwt_required()

    borrower = await crud.get_borrower_by_id(session, borrower_id)
    if borrower is None:
        raise HTTPException(status_code=404, detail="Borrower not found")
    return borrower

# @app.post("/{borrower_id}/bonds", response_model=schemas.BondsCountedResult)
# async def get_borrower_bonds(
#     borrower_id: int,
#     page: int = 1,
#     page_size: int = 20,
#     order_by: str | None = "id",
#     order: str | None = "asc",
#     filters: dict[str,Any] | None = {},
#     session: Session = Depends(get_session),
#     Authorize: AuthJWT = Depends()
# ):
#     Authorize.jwt_required()

#     if page and page < 1:
#         page = 1

#     bonds, total = await crud.get_bonds(session, page=page, page_size=page_size, order_by=order_by, order=order, filters=filters, borrower_id=borrower_id)
#     return {'results':bonds, 'total':total, 'page':page}

@app.get("/inn/{borrower_inn}", response_model=schemas.Borrower)
async def read_borrower_by_inn(
    borrower_inn: str,
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    # Authorize.jwt_required()

    borrower = await crud.get_borrower_by_inn(session, borrower_inn)
    if borrower is None:
        raise HTTPException(status_code=404, detail="Borrower not found")
    return borrower

@app.get("/history/", response_model=schemas.BorrowersHistoryCountedResult)
async def read_borrowers(
    page: int = 1,
    page_size: int = 100,
    order_by: str | None = "id",
    order: str | None = "asc",
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    # Authorize.jwt_required()

    history, total = await crud.get_borrowers_ratings_history(session, page=page, page_size=page_size, order_by=order_by, order=order)
    return {'results':history, 'total':total, 'page':page}