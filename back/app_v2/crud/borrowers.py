import math
from typing import Any
from sqlalchemy import func, select, exists, or_, and_
from sqlalchemy.orm import aliased
from sqlalchemy.orm import sessionmaker
from app_v2 import models
from app_v2 import schemas

async def get_all_borrowers(
    session_maker: sessionmaker
) -> list[models.Borrower]:

    result = []
    borrowers_statement = select(models.Borrower)

    with session_maker() as session:
        borrowers_query = session.execute(borrowers_statement)
        result = borrowers_query.scalars().all()
        session.close()
    return result

async def get_all_nonrated_borrowers(
    session_maker: sessionmaker,
    agency: str
) -> list[models.Borrower]:

    result = []
    borrowers_statement = \
        select(models.Borrower)\
        .filter(
            ~exists().where(
                models.LoadedRating.borrower_id==models.Borrower.id,
                models.LoadedRating.agency==agency,
            )
        )\
        .order_by(models.Borrower.id.asc())

    with session_maker() as session:
        borrowers_query = session.execute(borrowers_statement)
        result = borrowers_query.scalars().all()
        session.close()
    return result

async def get_borrowers(
    session_maker: sessionmaker,
    page: int = 1,
    page_size: int = 100,
    order_by: str | None = "id",
    order: str | None = "asc",
    filters: dict[str,Any] | None = {}
) -> tuple[ list[models.Borrower], int ]:

    result = []
    borrowers_statement = select(models.Borrower)

    loose_rating = getattr(filters,'loose_rating',True)
    mode = or_ if loose_rating == 1 else and_

    rating_aliases = {}
    rating_filters = []

    rating_alias_filter = aliased(models.BorrowerRating, name='rating_alias_filter_base')
    rating_alias_sort = aliased(models.BorrowerRating, name='rating_alias_sort')

    ############################
    #     NEED REFACTORING     #
    ############################

    for agency in ['acra','raexpert','nkr','nra']:
        agency_rating = getattr(filters,agency,[])
        if agency_rating:
            if loose_rating:
                rating_filters.append(
                    and_(
                        rating_alias_filter.agency==agency,
                        rating_alias_filter.value.in_(agency_rating)
                    ).self_group()
                )
            else:
                rating_aliases[agency] = aliased(models.BorrowerRating, name='rating_alias_filter_'+agency)
                rating_filters.append(
                    and_(
                        rating_aliases[agency].agency==agency,
                        rating_aliases[agency].value.in_(agency_rating)
                    ).self_group()
                )

    _search = getattr(filters,'search','')
    if _search :
        search = or_(
            models.Borrower.inn.like('%'+_search+'%'),
            models.Borrower.name.like('%'+_search+'%'),
        ).self_group()
        borrowers_statement = borrowers_statement.where(search)
    
    if rating_filters:
        if loose_rating:
            borrowers_statement = borrowers_statement.join(rating_alias_filter, rating_alias_filter.borrower_id==models.Borrower.id)
        else:
            for agency in rating_aliases:
                borrowers_statement = borrowers_statement.join(rating_aliases[agency], rating_aliases[agency].borrower_id==models.Borrower.id)
        borrowers_statement = borrowers_statement.where(
            mode(*rating_filters)
        )

    if order_by and order:
        if order_by.startswith('rating_'):
            borrowers_statement = borrowers_statement.outerjoin(rating_alias_sort, rating_alias_sort.borrower_id==models.Borrower.id)
            agency = order_by.replace('rating_','')
            borrowers_statement = borrowers_statement\
                .where(rating_alias_sort.agency==agency)\
                .group_by( models.Borrower.id, rating_alias_sort.value )\
                .order_by( rating_alias_sort.value.is_(None), getattr( rating_alias_sort.value, order )() )
        elif getattr(models.Borrower, order_by):
            borrowers_statement = borrowers_statement\
                .group_by( models.Borrower.id )\
                .order_by( getattr(models.Borrower, order_by).is_(None), getattr( getattr(models.Borrower, order_by), order )() )
    
    ############################
    #     NEED REFACTORING     #
    ############################

    total_statement = borrowers_statement\
        .with_only_columns(func.count(models.Borrower.id))\
        .group_by(None)\
        .order_by(None)

    if page and page_size:
        borrowers_statement = borrowers_statement.offset( (page-1) * page_size)
        borrowers_statement = borrowers_statement.limit(page_size)

    with session_maker() as session:
        borrowers_query = session.execute(borrowers_statement)
        result = borrowers_query.scalars().all()

        total_query = session.execute(total_statement)
        total = total_query.scalar()
                
        session.close()

    pages = math.ceil(total / page_size)
    if pages < 1:
        pages = 1

    return result, pages


async def get_borrower_by_id(
    session_maker: sessionmaker,
    borrower_id: int
) -> models.Borrower | None:

    result = None
    borrowers_statement = \
        select(models.Borrower)\
        .filter(models.Borrower.id == borrower_id)

    with session_maker() as session:
        borrowers_query = session.execute(borrowers_statement)
        result = borrowers_query.scalars().one_or_none()
        session.close()
    return result

async def get_borrower_by_inn(
    session_maker: sessionmaker,
    borrower_inn: str
) -> models.Borrower | None:

    result = None
    borrowers_statement = \
        select(models.Borrower)\
        .filter(models.Borrower.inn == borrower_inn)

    with session_maker() as session:
        borrowers_query = session.execute(borrowers_statement)
        result = borrowers_query.scalars().one_or_none()
        session.close()
    return result