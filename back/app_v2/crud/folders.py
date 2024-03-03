import math
from typing import Any
from sqlalchemy import func, distinct, select, delete, exists, or_, and_
from sqlalchemy.orm import aliased
from sqlalchemy.orm import sessionmaker
from app_v2.db import SQLALCHEMY_DATABASE_TYPE
if SQLALCHEMY_DATABASE_TYPE == 'mysql':
    from sqlalchemy.dialects.mysql import insert as msql_insert
if SQLALCHEMY_DATABASE_TYPE == 'psql':
    from sqlalchemy.dialects.postgresql import insert as psql_insert
from app_v2 import models
from app_v2 import schemas

async def get_folders(
    session_maker: sessionmaker,
    user_id: int | None = None,
    public: bool = False
) -> list[models.Folder]:
    
    result = []
    select_statement = \
        select(models.Folder)

    if user_id:
        select_statement = select_statement\
            .where(
                models.Folder.user_id == user_id
            )

    if public:
        select_statement = select_statement\
            .where(
                models.Folder.public == public
            )

    select_statement = select_statement\
        .order_by(
            models.Folder.sort_index.asc(),
            models.Folder.id.asc()
        )

    with session_maker() as session:
        select_query = session.execute(select_statement)
        result = select_query.scalars().all()

        session.close()

    return result


async def get_folder(
    session_maker: sessionmaker,
    folder_id: int
) -> models.Folder | None:

    result = None
    select_statement = \
        select(models.Folder)\
        .where(
            models.Folder.id == folder_id
        )\
        .limit(1)

    with session_maker() as session:
        select_query = session.execute(select_statement)
        result = select_query.scalars().one_or_none()
        session.close()

    return result


async def check_folder_exists(
    session_maker: sessionmaker,
    user_id: int,
    folder_name: str
) -> models.Folder | None:

    result = None
    select_statement = \
        select(models.Folder)\
        .where(
            models.Folder.name == folder_name,
            models.Folder.user_id == user_id
        )\
        .limit(1)

    with session_maker() as session:
        select_query = session.execute(select_statement)
        result = select_query.scalars().one_or_none()
        session.close()

    return result


async def create_folder(
    session_maker: sessionmaker,
    user_id: int,
    folder_name: str,
    folder_public: bool
) -> models.Folder | None:
    
    folder = models.Folder( name=folder_name, public=folder_public, user_id=user_id )

    with session_maker() as session:
        session.add(folder)
        session.commit()
        session.refresh(folder)
        session.close()

    return folder


async def update_folder(
    session_maker: sessionmaker,
    folder_id: int,
    folder_name: str,
    folder_public: bool
) -> models.Folder | None:
    
    folder = await get_folder(session_maker,folder_id)
    
    if folder:
        folder.name = folder_name
        folder.public = folder_public

        with session_maker() as session:
            session.add(folder)
            session.commit()
            session.refresh(folder)
            session.close()

    return folder


async def delete_folder(
    session_maker: sessionmaker,
    folder_id: int,
) -> None:

    with session_maker() as session:
        delete_statement = \
            delete(models.Folder)\
            .where(
                models.Folder.id == folder_id
            )

        session.execute( delete_statement )
        session.commit()
        session.close()
    return


async def add_bond_to_folder(
    session_maker: sessionmaker,
    folder_id: int,
    bond_id: int
) -> None:

    with session_maker() as session:

        if SQLALCHEMY_DATABASE_TYPE == 'mysql':
            insert_statement = \
                msql_insert(models.BondsInFolders)\
                .values({
                    models.BondsInFolders.folder_id: folder_id,
                    models.BondsInFolders.bond_id: bond_id,
                })\
                .on_duplicate_key_update(id=models.BondsInFolders.id)

        if SQLALCHEMY_DATABASE_TYPE == 'psql':
            insert_statement = \
                psql_insert(models.BondsInFolders)\
                .values({
                    models.BondsInFolders.folder_id: folder_id,
                    models.BondsInFolders.bond_id: bond_id,
                })\
                .on_conflict_do_nothing()

        session.execute( insert_statement )
        session.commit()
        session.close()
    return


async def remove_bond_from_folder(
    session_maker: sessionmaker,
    folder_id: int,
    bond_id: int
) -> None:

    with session_maker() as session:
        delete_statement = \
            delete(models.BondsInFolders)\
            .where(
                models.BondsInFolders.folder_id == folder_id,
                models.BondsInFolders.bond_id == bond_id,
            )

        session.execute( delete_statement )
        session.commit()
        session.close()
    return
