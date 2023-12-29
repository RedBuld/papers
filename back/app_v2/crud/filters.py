import math
from typing import Any
from sqlalchemy import func, distinct, select, exists, or_, and_
from sqlalchemy.orm import aliased
from sqlalchemy.orm import sessionmaker
from app_v2 import models
from app_v2 import schemas

async def get_filters_bonds_ratings(
    session_maker: sessionmaker
) -> dict[str,str]:

    result = {}

    with session_maker() as session:
        for agency in ['acra','raexpert','nkr','nra']:

            ratings_statement = \
                select( distinct(models.BondCompositeRating.value) )\
                .where(
                    models.BondCompositeRating.agency==agency
                )\
                .order_by( models.BondCompositeRating.value.asc() )

            ratings_query = session.execute(ratings_statement)
            ratings = ratings_query.scalars().all()

            result[agency] = []

            for rating in ratings:
                result[agency].append( rating )
        
        session.close()

    return result

async def get_filters_bonds_statuses(
    session_maker: sessionmaker
) -> list[str]:

    result = []

    statuses_statement = \
        select( distinct(models.Bond.status) )\
        .order_by( models.Bond.status.asc() )

    with session_maker() as session:
        statuses_query = session.execute(statuses_statement)
        result = statuses_query.scalars().all()
        
        session.close()

    return result


async def get_filters_bonds_attributes(
    session_maker: sessionmaker
) -> dict[str,dict]:
    _res = {}

    _modes = {
        'dist_date_start': 'date-range',
        'dist_date_end': 'date-range',
        'maturity_date': 'date-range',
        'offer_date': 'date-range',
        'closest_date': 'date-range',
        'coupon_date': 'date-range',
        'buyback_date': 'date-range',
    }

    _query_select = []
    _query_result_map = []

    _query_range_fields = [
        'dist_date_start','dist_date_end','maturity_date','offer_date','closest_date','coupon_date','buyback_date', # dates
    ]
    # _floats_range = ()
    # _ints_range = ()

    # prepare query

    for _field in _query_range_fields:
        attr = getattr(models.Bond,_field,None)
        
        if attr:
            # get min value
            _query_select.append( func.min(attr) )
            _query_result_map.append((_field,'min'))

            # get max value
            _query_select.append( func.max(attr) )
            _query_result_map.append((_field,'max'))

    # get data

    statement = select(*_query_select)

    with session_maker() as session:
        query = session.execute(statement)
        attrs = query.all()[0]
        
        session.close()

    for index,value in enumerate(attrs):
        _map = _query_result_map[index]
        if _map[0] not in _res:
            _res[ _map[0] ] = {
                'mode': _modes[ _map[0] ],
                'options': {
                    'min': '',
                    'max': '',
                    'mode': _modes[ _map[0] ]
                }
            }

        try:
            if value:
                _res[ _map[0] ]['options'][ _map[1] ] = value
            else:
                _res[ _map[0] ]['options'][ _map[1] ] = ''
        except:
            _res[ _map[0] ]['options'][ _map[1] ] = ''
    return _res


async def get_filters_borrowers_ratings(
    session_maker: sessionmaker
) -> dict[str,str]:

    result = {}

    with session_maker() as session:
        for agency in ['acra','raexpert','nkr','nra']:

            ratings_statement = \
                select( distinct(models.BorrowerRating.value) )\
                .where(
                    models.BorrowerRating.agency==agency
                )\
                .order_by( models.BorrowerRating.value.asc() )

            ratings_query = session.execute(ratings_statement)
            ratings = ratings_query.scalars().all()

            result[agency] = []

            for rating in ratings:
                result[agency].append( rating )
        
        session.close()

    return result