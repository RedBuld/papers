import math
from typing import Any
from sqlalchemy import func, distinct, select, exists, or_, and_
from sqlalchemy.orm import aliased
from sqlalchemy.orm import sessionmaker
from app_v2 import models
from app_v2 import schemas

# Borrowers

async def get_borrower_rating(
    session_maker: sessionmaker,
    borrower_id: int,
    agency: str,
) -> models.BorrowerRating | None:
    
    result = None
    ratings_statement = \
        select( models.BorrowerRating )\
        .filter(
            models.BorrowerRating.borrower_id == borrower_id,
            models.BorrowerRating.agency == agency
        )
    
    with session_maker() as session:
        ratings_query = session.execute(ratings_statement)
        result = ratings_query.scalars().one_or_none()
        
        session.close()

    return result

async def get_borrowers_ratings_history(
    session_maker: sessionmaker,
    page: int = 1,
    page_size: int = 1,
    order_by: str | None = "id",
    order: str | None = "asc"
) -> tuple[ list[models.BorrowerRatingHistory], int ]:
    
    result = []
    ratings_statement = select( models.BorrowerRatingHistory )\
        .where(
            models.BorrowerRatingHistory.date!=None
        )\

    if order_by and order:
        ratings_statement = ratings_statement\
            .group_by( models.BorrowerRatingHistory.id )

        attr = getattr( models.BorrowerRatingHistory, order_by )
        if attr:
            ratings_statement = ratings_statement\
                .order_by(
                    attr.is_(None),
                    getattr( attr, order )()
                )

    total_statement = ratings_statement\
        .with_only_columns(func.count(models.BorrowerRatingHistory.id))\
        .group_by(None)\
        .order_by(None)
    
    ratings_statement = ratings_statement\
        .order_by(
            models.BorrowerRatingHistory.date.desc(),
            models.BorrowerRatingHistory.id.desc(),
        )

    if page and page_size:
        ratings_statement = ratings_statement.offset( (page-1) * page_size )
        ratings_statement = ratings_statement.limit( page_size )

    with session_maker() as session:
        ratings_query = session.execute(ratings_statement)
        result = ratings_query.scalars().all()

        total_query = session.execute(total_statement)
        total = total_query.scalar()
        
        session.close()

    pages = math.ceil(total / page_size)
    if pages < 1:
        pages = 1

    return result, pages

# Bonds

async def get_bond_rating(
    session_maker: sessionmaker,
    bond_id: int,
    agency: str
) -> models.BondRating | None:
    
    result = None
    ratings_statement = \
        select( models.BondRating )\
        .filter(
            models.BondRating.bond_id == bond_id,
            models.BondRating.agency == agency
        )
    
    with session_maker() as session:
        ratings_query = session.execute(ratings_statement)
        result = ratings_query.scalars().one_or_none()
        
        session.close()

    return result

async def get_bond_composite_rating(
    session_maker: sessionmaker,
    bond_id: int,
    agency: str
) -> models.BondCompositeRating | None:
    
    result = None
    ratings_statement = \
        select(models.BondCompositeRating)\
        .filter(
            models.BondCompositeRating.bond_id == bond_id,
            models.BondCompositeRating.agency == agency
        )
    
    with session_maker() as session:
        ratings_query = session.execute(ratings_statement)
        result = ratings_query.scalars().one_or_none()
        
        session.close()

    return result
