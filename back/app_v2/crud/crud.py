import math, random
from datetime import datetime, timedelta
from sqlalchemy import update, Numeric, cast, distinct, or_, and_
from sqlalchemy.orm import aliased
from sqlalchemy.orm import sessionmaker
from app_v2 import models, schemas
from sqlalchemy import text, exists, func
from fastapi_cache.decorator import cache
from typing import Any
# from app_v2.db import engine

# Bond

async def get_bond_by_id(session_maker: sessionmaker, bond_id: int):
    return session.query(models.Bond).filter(models.Bond.id == bond_id).first()

async def get_bond_by_isin(session_maker: sessionmaker, isin: str):
    return session.query(models.Bond).filter(models.Bond.isin == isin).first()

async def create_bond(session_maker: sessionmaker, bond: schemas.BondCreate):
    db_bond = models.Bond(**bond)
    session.add(db_bond)
    session.commit()
    session.refresh(db_bond)
    return db_bond

async def update_bond(session_maker: sessionmaker, bond: schemas.BondCreate):
    db_bond = None
    if 'isin' in bond:
        db_bond = await get_bond_by_isin(session, bond['isin'])
    elif 'id' in bond:
        db_bond = await get_bond_by_id(session, bond['id'])
    if not db_bond:
        return await create_bond(session, bond)

    for _key, _value in bond.items():
        setattr(db_bond, _key, _value)
    session.add(db_bond)
    session.commit()
    session.refresh(db_bond)
    return db_bond

# Bond rating

async def get_bond_rating(session_maker: sessionmaker, bond_rating: schemas.BondRatingCreate):
    return session.query(models.BondRating).filter(models.BondRating.bond_id == bond_rating['bond_id'], models.BondRating.agency == bond_rating['agency']).first()

async def create_bond_rating(session_maker: sessionmaker, bond_rating: schemas.BondRatingCreate):
    db_bond_rating = models.BondRating(**bond_rating)
    session.add(db_bond_rating)
    session.commit()
    session.refresh(db_bond_rating)
    return db_bond_rating

async def update_bond_rating(session_maker: sessionmaker, bond_rating: schemas.BondRatingCreate):
    db_bond_rating = await get_bond_rating(session, bond_rating)
    if not db_bond_rating:
        return None

    for _key, _value in bond_rating.items():
        setattr(db_bond_rating, _key, _value)
    session.add(db_bond_rating)
    session.commit()
    session.refresh(db_bond_rating)
    return db_bond_rating

# Internal use only
async def update_or_create_bond_rating(session_maker: sessionmaker, bond_rating: schemas.BondRatingCreate):
    db_bond_rating = await get_bond_rating(session, bond_rating)
    if not db_bond_rating:
        return await create_bond_rating(session, bond_rating)

    for _key, _value in bond_rating.items():
        setattr(db_bond_rating, _key, _value)
    session.add(db_bond_rating)
    session.commit()
    session.refresh(db_bond_rating)
    return db_bond_rating

async def delete_bond_rating(session_maker: sessionmaker, bond_rating: schemas.BondRatingCreate):
    db_bond_rating = await get_bond_rating(session, bond_rating)
    if db_bond_rating:
        session.delete(db_bond_rating)
        session.commit()

async def get_bond_composite_rating(session_maker: sessionmaker, bond_id: int, agency: str):
    return session.query(models.BondCompositeRating).filter(models.BondCompositeRating.bond_id == bond_id, models.BondCompositeRating.agency == agency).first()

# Internal use only
async def create_bond_composite_rating(session_maker: sessionmaker, bond_rating: schemas.BondCompositeRatingCreate):
    db_bond_rating = models.BondCompositeRating(**bond_rating)
    session.add(db_bond_rating)
    session.commit()
    session.refresh(db_bond_rating)
    return db_bond_rating

async def delete_bond_composite_rating(session_maker: sessionmaker, bond_id: int, agency: str):
    db_bond_rating = await get_bond_composite_rating(session, bond_id, agency)
    if db_bond_rating:
        session.delete(db_bond_rating)
        session.commit()

# Folder

async def get_folders(session_maker: sessionmaker, user_id: int | None = None, public: bool = False):
    q = session.query(models.Folder)
    if user_id:
        q = q.filter(models.Folder.user_id == user_id)
    if public:
        q = q.filter(models.Folder.public == public)
    q = q.order_by(models.Folder.sort_index.asc(),models.Folder.id.asc())
    return q.all()

async def get_folder(session_maker: sessionmaker, folder_id: int):
    return session.query(models.Folder).filter(models.Folder.id == folder_id).first()

async def check_folder_exists(session_maker: sessionmaker, user_id: int, folder: schemas.FolderBase):
    return session.query(models.Folder).filter(models.Folder.name == folder['name'], models.Folder.user_id == user_id).first()

# async def get_folders_by_user(session_maker: sessionmaker, user_id: int, skip: int = 0, limit: int = 100, order_by: str | None = "id", order: str | None = "asc"):
#     return session.query(models.Folder).order_by( getattr( getattr(models.Folder, order_by), order )() ).filter(models.Folder.user_id == user_id).offset(skip).limit(limit).all()

async def create_folder(session_maker: sessionmaker, user_id: int, folder: schemas.FolderCreate):
    db_folder = models.Folder(**folder)
    db_folder.user_id = user_id
    session.add(db_folder)
    session.commit()
    session.refresh(db_folder)
    return db_folder

async def update_folder(session_maker: sessionmaker, folder: schemas.FolderUpdate):
    db_folder = await get_folder(session, folder['id'])
    if not db_folder:
        return await create_folder(session, folder)

    for _key, _value in folder.items():
        setattr(db_folder, _key, _value)
    session.add(db_folder)
    session.commit()
    session.refresh(db_folder)
    return db_folder

async def delete_folder(session_maker: sessionmaker, folder: schemas.Folder):
    session.query(models.bonds_in_folders).where(models.bonds_in_folders.c.folder_id==folder.id).delete()
    session.delete(folder)
    session.commit()

async def add_bond_to_folder(session_maker: sessionmaker, folder: schemas.Folder, bond: schemas.Bond):
    if bond not in folder.bonds:
        folder.bonds.append(bond)
        session.commit()
    session.refresh(folder)
    return folder

async def remove_bond_from_folder(session_maker: sessionmaker, folder: schemas.Folder, bond: schemas.Bond):
    if bond in folder.bonds:
        folder.bonds.remove(bond)
        session.commit()
    session.refresh(folder)
    return folder


# RaExpert links cache


async def get_raexpert_cache(session_maker: sessionmaker, borrower_id: int | None = None, bond_id: int | None = None):
    if borrower_id:
        return session.query(models.RaExpertLinkCache).filter(models.RaExpertLinkCache.borrower_id == borrower_id).first()
    if bond_id:
        return session.query(models.RaExpertLinkCache).filter(models.RaExpertLinkCache.bond_id == bond_id).first()
    return None


async def create_raexpert_cache(session_maker: sessionmaker, cache_link: schemas.RaExpertCacheCreate):
    db_cache_link = models.RaExpertLinkCache(**cache_link)
    session.add(db_cache_link)
    session.commit()
    session.refresh(db_cache_link)
    return db_cache_link


# Gcurve

async def get_gcurve(session_maker: sessionmaker, gcurve: schemas.GcurveCreate):
    return session.query(models.Gcurve).filter(models.Gcurve.period == gcurve['period']).first()

async def create_gcurve(session_maker: sessionmaker, gcurve: schemas.Gcurve):
    db_gcurve = models.Gcurve(**gcurve)
    session.add(db_gcurve)
    session.commit()
    session.refresh(db_gcurve)
    return db_gcurve

async def update_gcurve(session_maker: sessionmaker, gcurve: schemas.Gcurve):
    db_gcurve = await get_gcurve(session, gcurve)
    if not db_gcurve:
        return await create_gcurve(session, gcurve)

    for _key, _value in gcurve.items():
        setattr(db_gcurve, _key, _value)
    session.add(db_gcurve)
    session.commit()
    session.refresh(db_gcurve)
    return db_gcurve


async def get_feedbacks(session_maker: sessionmaker, page: int = 1, user_id: int | None = None):

    page_size = 20
    q = session.query(models.Feedback)
    if user_id:
        q = q.filter(models.Feedback.user_id==user_id)

    q = q.order_by( models.Feedback.created_at.desc() )

    total = q.count()
    pages = 1
    if page:
        q = q.offset( (page-1) * page_size)
        q = q.limit(page_size)
        pages = math.ceil(total / page_size)
    if pages < 1:
        pages = 1

    return q.all(), pages

async def get_feedback(session_maker: sessionmaker, feedback_id: int):
    return session.query(models.Feedback).filter(models.Feedback.id == feedback_id).first()

async def create_feedback(session_maker: sessionmaker, feedback: schemas.FeedbackCreate):
    db_feedback = models.Feedback(**feedback)
    session.add(db_feedback)
    session.commit()
    session.refresh(db_feedback)
    return db_feedback

async def delete_feedback(session_maker: sessionmaker, feedback_id: int):
    db_feedback = get_feedback(session, feedback_id)

    if db_feedback:
        session.delete(db_feedback)
        session.commit()
        return db_feedback

    return None


async def get_features(session_maker: sessionmaker):
    return session.query(models.Feature).order_by(models.Feature.created_at.desc()).all()

async def get_last_feature(session_maker: sessionmaker):
    last = session.query(models.Feature.created_at).order_by(models.Feature.created_at.desc()).first()
    if last:
        return last[0]
    return ''

async def create_feature(session_maker: sessionmaker, feature: schemas.FeatureCreate):
    db_feature = models.Feature(**feature)
    session.add(db_feature)
    session.commit()
    session.refresh(db_feature)
    return db_feature


async def get_chats(session_maker: sessionmaker):
    return session.query(models.Chat).order_by(models.Chat.updated.desc()).all()

async def get_chat(session_maker: sessionmaker, chat_id: int, user: models.User):
    chat = session.query(models.Chat).get(chat_id)
    if chat:
        if user.role == 3:
            chat.unread_admin = False
        else:
            chat.unread_owner = False
        session.add(chat)
        session.commit()
        session.refresh(chat)
    return chat

async def get_chat_messages(session_maker: sessionmaker, chat_id: int, user: models.User):
    chat = session.query(models.Chat).get(chat_id)
    if chat:
        if user.role == 3:
            chat.unread_admin = False
        else:
            chat.unread_owner = False
        session.add(chat)
        session.commit()
        session.refresh(chat)

    return session.query(models.ChatMessage).where(models.ChatMessage.chat_id==chat_id).order_by(models.ChatMessage.created.asc()).all()

async def count_unread_chats(session_maker: sessionmaker, user_id: int | None = None):
    if not user_id:
        return session.query(models.Chat.id).where(models.Chat.unread_admin==1).count()
    else:
        return session.query(models.Chat.id).where(models.Chat.id==user_id,models.Chat.unread_owner==1).count()

async def new_chat_message(session_maker: sessionmaker, chat_id: int, user: models.User, message: schemas.ChatNewMessage):
    chat = session.query(models.Chat).get(chat_id)
    if not chat:
        chat = models.Chat(id=chat_id)
        session.add(chat)
        session.commit()

    chat_msg = models.ChatMessage(**message)
    chat_msg.chat_id = chat_id
    chat_msg.user_id = user.id
    session.add(chat_msg)
    session.commit()
    session.refresh(chat_msg)

    if user.role == 3:
        chat.unread_owner = True
    else:
        chat.unread_admin = True
    chat.updated = chat_msg.created
    session.add(chat)
    session.commit()
    session.refresh(chat)
    return True



# FILTERS


async def get_bonds_filters_ratings(session_maker: sessionmaker, *args):
    _res = {}
    for agency in ['acra','raexpert','nkr','nra']:
        _res[agency] = []
        res = session.query(distinct(models.BondCompositeRating.value)).where(models.BondCompositeRating.agency==agency).order_by( models.BondCompositeRating.value.asc() ).all()
        for r in res:
            if r[0]:
                _res[agency].append(r[0])
    return _res

async def get_bonds_forecasts(session_maker: sessionmaker, *args):
    _res = []
    res = session.query(distinct(models.BondCompositeRating.forecast)).order_by( models.BondCompositeRating.forecast.asc() ).all()
    for r in res:
        if r[0]:
            _res.append(r[0])
    return _res

async def get_bonds_filters_statuses(session_maker: sessionmaker, *args):
    _res = []
    res = session.query(distinct(models.Bond.status)).order_by( models.Bond.status.asc() ).all()
    for r in res:
        if r[0]:
            _res.append(r[0])
    return _res

async def get_bonds_filters_attributes(session_maker: sessionmaker, *args):
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

    _query_result = session.query(*_query_select).all()[0]

    for index,value in enumerate(_query_result):
        _map = _query_result_map[index]
        if _map[0] not in _res:
            _res[ _map[0] ] = {
                'mode': _modes[ _map[0] ],
                'values': {
                    'min': '',
                    'max': '',
                    'mode': _modes[ _map[0] ]
                }
            }

        try:
            if value:
                _res[ _map[0] ]['values'][ _map[1] ] = value
            else:
                _res[ _map[0] ]['values'][ _map[1] ] = ''
        except:
            _res[ _map[0] ]['values'][ _map[1] ] = ''
    return _res