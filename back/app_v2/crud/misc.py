from datetime import datetime
from sqlalchemy import func, distinct, select, exists, or_, and_
from sqlalchemy.orm import sessionmaker
from app_v2 import models
from app_v2 import schemas

async def get_curve(
    session_maker: sessionmaker
) -> dict[int,dict]:

    result = {}

    with session_maker() as session:

        curve_statement = \
            select(models.Gcurve)\
            .order_by( models.Gcurve.period.asc() )
        
        ratings_query = session.execute(curve_statement)
        curves = ratings_query.scalars().all()

        for curve in curves:
            result[int(float(curve.period)*12)] = {
                'value': float(curve.value),
                'period': curve.period,
                'monthly': float(curve.monthly),
            }

        session.close()

    return result

async def get_curve_history(
    session_maker: sessionmaker,
    from_date: datetime.date = datetime.today
) -> list[models.GcurveHistory]:

    result = []

    with session_maker() as session:

        history_statement = \
            select( models.GcurveHistory )\
            .where(
                models.GcurveHistory.date >= from_date
            )\
            .order_by( models.GcurveHistory.date.asc() )
        
        ratings_query = session.execute(history_statement)
        result = ratings_query.scalars().all()

        session.close()

    return result

async def get_features(
    session_maker: sessionmaker
) -> list[models.Feature]:
    result = []

    with session_maker() as session:

        features_statement = \
            select( models.Feature )\
            .order_by(
                models.Feature.created_at.desc()
            )
        
        ratings_query = session.execute(features_statement)
        result = ratings_query.scalars().all()

        session.close()

    return result

async def create_feature(
    session_maker: sessionmaker,
    feature_text: str
) -> models.Feature:
    feature = models.Feature(text=feature_text)
    with session_maker() as session:
        session.add(feature)
        session.commit()
        session.refresh(feature)
        session.close()
    return feature