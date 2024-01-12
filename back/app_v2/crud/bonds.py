import math
from datetime import datetime, timedelta
from typing import Any
from sqlalchemy import func, select, exists, or_, and_
from sqlalchemy.orm import aliased
from sqlalchemy.orm import sessionmaker
from app_v2 import models
from app_v2 import schemas

async def get_all_bonds(
    session_maker: sessionmaker
) -> list[models.Bond]:

    result = []
    bonds_statement = select(models.Bond)

    with session_maker() as session:
        bonds_query = session.execute(bonds_statement)
        result = bonds_query.scalars().all()
        session.expunge(result)
        session.close()
    return result

async def get_all_nonrated_bonds(
    session_maker: sessionmaker,
    agency: str = ''
) -> list[models.Bond]:

    result = []
    bonds_statement = \
        select(models.Bond)\
        .filter(
            ~exists().where(
                models.LoadedRating.bond_id==models.Bond.id,
                models.LoadedRating.agency==agency,
            )
        )\
        .order_by(models.Bond.id.asc())

    with session_maker() as session:
        bonds_query = session.execute(bonds_statement)
        result = bonds_query.scalars().all()
        session.close()
    return result

async def get_bonds(
    session_maker: sessionmaker,
    page: int | None = 1,
    page_size: int | None = 50,
    order_by: str | None = "id",
    order: str | None = "asc",
    filters: dict[str,Any] | None = {}
) -> tuple[ list[models.Bond], int ]:
    
    result = []
    bonds_statement = select(models.Bond)

    ### STATIC FILTERS ###
    loose_ratings = filters.pop('loose_ratings',True)
    static_filter_fresh = filters.pop('fresh',False)
    #
    static_filter_borrower_id = filters.pop('borrower_id',None)
    static_filter_folder_id = filters.pop('folder_id',None)
    #
    static_filter_status = filters.pop('status',[])
    static_filter_search = filters.pop('search','')
    ### STATIC FILTERS ###

    print('BONDS REQUEST')
    print('')
    print('filters',filters)
    print('')
    print('static_filter_status',static_filter_status)
    print('')
    print('static_filter_search',static_filter_search)
    print('')
    print('loose_ratings',loose_ratings)

    rating_filter_mode = or_ if loose_ratings == True else and_
    
    composite_aliases: dict[str, models.BondCompositeRating] = {}
    rating_filters = []

    composite_alias_filter = aliased(models.BondCompositeRating, name='composite_alias_filter_base')
    composite_alias_sort = aliased(models.BondCompositeRating, name='composite_alias_sort')
    borrowers_alias_search = aliased(models.Borrower, name='borrowers_alias_search')

    ############################
    #     NEED REFACTORING     #
    ############################

    ### STATIC FILTERS ###
    if static_filter_status:
        bonds_statement = bonds_statement\
            .where( models.Bond.status.in_(static_filter_status) )

    if static_filter_search:
        static_filter_search = '%'+static_filter_search+'%'
        #
        bonds_statement = bonds_statement\
            .outerjoin(borrowers_alias_search, borrowers_alias_search.id==models.Bond.borrower_id)\
            .where(
                or_(
                    borrowers_alias_search.inn.like(static_filter_search),
                    models.Bond.isin.like(static_filter_search),
                    models.Bond.name.like(static_filter_search),
                ).self_group()
            )

    if static_filter_fresh:
        start_date = datetime.today().date() - timedelta(days=7)
        bonds_statement = bonds_statement\
            .where(models.Bond.dist_date_start >= start_date)

    if static_filter_folder_id:
        bonds_statement = bonds_statement\
            .join(models.BondsInFolders, models.BondsInFolders.bond_id==models.Bond.id)\
            .where(models.BondsInFolders.folder_id==static_filter_folder_id)

    if static_filter_borrower_id:
        bonds_statement = bonds_statement\
            .where(models.Bond.borrower_id==static_filter_borrower_id)
    ### STATIC FILTERS ###

    for key in filters:
        # filters for rating
        if key.startswith('rating_'):
            agency_ratings = filters[key]
            if agency_ratings:
                agency = key.replace('rating_','',1)

                if loose_ratings:
                    rating_filters.append(
                        and_(
                            composite_alias_filter.agency==agency,
                            composite_alias_filter.value.in_(agency_ratings)
                        ).self_group()
                    )
                else:
                    composite_aliases[agency] = aliased(models.BondCompositeRating, name='composite_alias_filter_'+agency)
                    rating_filters.append(
                        and_(
                            composite_aliases[agency].agency==agency,
                            composite_aliases[agency].value.in_(agency_ratings)
                        ).self_group()
                    )

    if rating_filters:
        if loose_ratings:
            bonds_statement = bonds_statement.join(composite_alias_filter, composite_alias_filter.bond_id==models.Bond.id)
        else:
            for agency in composite_aliases:
                bonds_statement = bonds_statement.join(composite_aliases[agency], composite_aliases[agency].bond_id==models.Bond.id)

        bonds_statement = bonds_statement\
            .where(
                rating_filter_mode(*rating_filters)
            )

    if order_by and order:
        if order_by.startswith('rating_'):
            agency = order_by.replace('rating_','')
            bonds_statement = bonds_statement\
                .outerjoin(composite_alias_sort, composite_alias_sort.bond_id==models.Bond.id)\
                .where(composite_alias_sort.agency==agency)\
                .group_by( models.Bond.id, composite_alias_sort.value )\
                .order_by( composite_alias_sort.value.is_(None), getattr( composite_alias_sort.value, order )() )
        else:
            attr = getattr(models.Bond, order_by)
            if attr:
                bonds_statement = bonds_statement\
                    .group_by( models.Bond.id )\
                    .order_by(
                        attr.is_(None),
                        getattr( attr, order )()
                    )

    ############################
    #     NEED REFACTORING     #
    ############################

    total_statement = bonds_statement\
        .with_only_columns(func.count(models.Bond.id))\
        .group_by(None)\
        .order_by(None)

    if page and page_size:
        bonds_statement = bonds_statement\
            .offset( (page-1) * page_size )\
            .limit(page_size)

    with session_maker() as session:
        
        bond_query = session.execute(bonds_statement)
        result = bond_query.scalars().all()

        total_query = session.execute(total_statement)
        total = total_query.scalar()
        
        session.close()

    from app_v2.db import engine_front
    print('='*20)
    print('='*20)
    print( bonds_statement.compile(engine_front,compile_kwargs={"literal_binds": True}) )
    print('='*20)
    print('='*20)
    # print('='*20)
    # print('='*20)
    # print( total_statement.compile(engine_front,compile_kwargs={"literal_binds": True}) )
    # print('='*20)
    # print('='*20)

    try:
        pages = math.ceil(total / page_size)
    except:
        pages = 1
    if pages < 1:
        pages = 1

    return result, pages

async def get_bond_by_id(
    session_maker: sessionmaker,
    bond_id: int
) -> models.Bond | None:

    result = None
    bonds_statement = \
        select(models.Bond)\
        .filter(models.Bond.id == bond_id)

    with session_maker() as session:
        bonds_query = session.execute(bonds_statement)
        result = bonds_query.scalars().one_or_none()
        session.close()

    return result

async def get_bond_by_isin(
    session_maker: sessionmaker,
    bond_isin: str
) -> models.Bond | None:

    result = None
    bonds_statement = \
        select(models.Bond)\
        .filter(models.Bond.isin == bond_isin)

    with session_maker() as session:
        bonds_query = session.execute(bonds_statement)
        result = bonds_query.scalars().one_or_none()
        session.close()

    return result

#

async def get_bonds_by_top3_folders(
    session_maker: sessionmaker
) -> list[models.Bond]:
    
    result = []

    folders = []
    folders_statement = \
        select(models.Folder)\
        .filter(
            models.Folder.top3==True,
            models.Folder.public==True
        )\
        .order_by(
            models.Folder.sort_index.asc(),
            models.Folder.name.asc()
        )
    with session_maker() as session:
        folders_query = session.execute(folders_statement)
        folders = folders_query.scalars().all()
        session.close()
    

    for folder in folders:

        bonds = []
        bonds_statement = \
            select( models.Bond )\
            .join(
                models.BondsInFolders,
                models.BondsInFolders.bond_id==models.Bond.id
            )\
            .filter(
                models.BondsInFolders.folder_id==folder.id
            )\
            .group_by(
                models.Bond.id
            )\
            .order_by(
                models.Bond.bonus_dur.is_(None),
                models.Bond.bonus_dur.desc()
            )\
            .limit( 3 )
        with session_maker() as session:
            bonds_query = session.execute(bonds_statement)
            bonds = bonds_query.scalars().all()
            session.close()

        group = {
            'folder': folder,
            'bonds': [],
        }
        for bond in bonds:
            group['bonds'].append(bond)
        
        if len(group['bonds']) > 0:
            result.append(group)

    return result

# 

async def has_coming_bonds(
    session_maker: sessionmaker
) -> bool:

    total = 0
    total_statement = \
        select(func.count(models.UpcomingBonds.id))\
        .order_by(None)\
        .limit(1)

    with session_maker() as session:
        total_query = session.execute(total_statement)
        total = total_query.scalar()
        session.close()

    return total > 0

async def has_fresh_bonds(
    session_maker: sessionmaker
) -> bool:

    start_date = datetime.today().date() - timedelta(days=7)

    total = 0
    total_statement = \
        select( func.count(models.Bond.id) )\
        .where(
            models.Bond.status=='В обращении',
            models.Bond.dist_date_start >= start_date
        )\
        .order_by(None)\
        .limit(1)

    with session_maker() as session:
        total_query = session.execute(total_statement)
        total = total_query.scalar()
        session.close()

    return total > 0

# 

async def get_coming_bonds(
    session_maker: sessionmaker,
    page: int = 1,
    page_size: int = 20,
    order_by: str | None = "id",
    order: str | None = "asc"
) -> tuple[ list[models.UpcomingBonds], int ]:

    result = []
    bonds_statement = select(models.UpcomingBonds)

    if order_by and order:
        attr = getattr(models.UpcomingBonds, order_by)
        if attr:
            bonds_statement = bonds_statement\
                .group_by( models.UpcomingBonds.id )\
                .order_by(
                    attr.is_(None),
                    getattr( attr, order )()
                )

    total_statement = bonds_statement
    total_statement = total_statement.with_only_columns(func.count(models.UpcomingBonds.id)).order_by(None)

    if page and page_size:
        bonds_statement = bonds_statement.offset( (page-1) * page_size)
        bonds_statement = bonds_statement.limit(page_size)

    with session_maker() as session:
        borrowers_query = session.execute(bonds_statement)
        result = borrowers_query.scalars().all()

        total_query = session.execute(total_statement)
        total = total_query.scalar()
        
        session.close()

    pages = math.ceil(total / page_size)
    if pages < 1:
        pages = 1

    return result, pages