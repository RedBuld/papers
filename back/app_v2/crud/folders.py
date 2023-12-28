import math
from typing import Any
from sqlalchemy import func, distinct, select, exists, or_, and_
from sqlalchemy.orm import aliased
from sqlalchemy.orm import sessionmaker
from app_v2 import models
from app_v2 import schemas

async def get_folders(
    session_maker: sessionmaker,
    user_id: int | None = None,
    public: bool = False
) -> list[models.Folder]:
    
    result = []
    folders_statement = select(models.Folder)

    if user_id:
        folders_statement = folders_statement.where(models.Folder.user_id == user_id)

    if public:
        folders_statement = folders_statement.where(models.Folder.public == public)

    folders_statement = folders_statement\
        .order_by(
            models.Folder.sort_index.asc(),
            models.Folder.id.asc()
        )

    with session_maker() as session:
        folders_query = session.execute(folders_statement)
        result = folders_query.scalars().all()

        session.close()

    return result

async def get_folder(
    session_maker: sessionmaker,
    folder_id: int
) -> models.Folder | None:

    result = None
    folders_statement = \
        select(models.Folder)\
        .where(models.Folder.id == folder_id)

    with session_maker() as session:
        folders_query = session.execute(folders_statement)
        result = folders_query.scalars().one_or_none()
        session.close()

    return result

async def check_folder_exists(
    session_maker: sessionmaker,
    user_id: int,
    folder_name: str
) -> models.Folder | None:

    result = None
    folders_statement = \
        select(models.Folder)\
        .where(
            models.Folder.name == folder_name,
            models.Folder.user_id == user_id
        )\
        .limit(1)

    with session_maker() as session:
        folders_query = session.execute(folders_statement)
        result = folders_query.scalars().one_or_none()
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
    folder: schemas.Folder
) -> None:
    # session.query(models.bonds_in_folders).where(models.bonds_in_folders.c.folder_id==folder.id).delete()
    # session.delete(folder)
    # session.commit()
    return


async def add_bond_to_folder(
    session_maker: sessionmaker,
    folder: schemas.Folder,
    bond: schemas.Bond
):


    # if bond not in folder.bonds:
    #     folder.bonds.append(bond)
    #     session.commit()
    # session.refresh(folder)
    return folder

async def remove_bond_from_folder(
    session_maker: sessionmaker,
    folder: schemas.Folder,
    bond: schemas.Bond
):
    # if bond in folder.bonds:
    #     folder.bonds.remove(bond)
    #     session.commit()
    # session.refresh(folder)
    return folder
