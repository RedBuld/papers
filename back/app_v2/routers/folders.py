from datetime import datetime
from typing import Any
from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi_jwt_auth import AuthJWT
from sqlalchemy.orm import Session
from app_v2 import crud, schemas
from app_v2.dependencies import get_session

app = APIRouter(
    prefix="/folders",
    tags=['folders'],
)

@app.get("/", response_model=list[schemas.Folder])
async def private_folders(
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    Authorize.jwt_required()

    user_id = Authorize.get_jwt_subject()

    folders = await crud.get_folders(session, user_id=user_id)

    return folders

@app.post("/", response_model=schemas.Folder)
async def create_folder(
    folder_data: schemas.FolderCreate,
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    Authorize.jwt_required()

    user_id = Authorize.get_jwt_subject()
    user = await crud.get_user_by_id(session, user_id)

    folder = await crud.check_folder_exists(session, user_id=user.id, folder_name=folder_data.name)

    if folder:
        raise HTTPException(status_code=400, detail="Папка с таким названием уже существует")

    folder = await crud.create_folder(session, user_id=user.id, folder_name=folder_data.name, folder_public=folder_data.public)

    if not folder:
        raise HTTPException(status_code=404, detail="Произошла ошибка")

    return folder

@app.get("/folder/public/", response_model=list[schemas.Folder])
async def public_folders(
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    Authorize.jwt_required()

    folders = await crud.get_folders(session, public=True)

    return folders

@app.get("/folder/{folder_id}", response_model=schemas.Folder)
async def read_folder(
    folder_id: int,
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    Authorize.jwt_required()
    user_id = Authorize.get_jwt_subject()
    user = await crud.get_user_by_id(session, user_id)

    folder = await crud.get_folder(session, folder_id)

    if folder is None:
        raise HTTPException(status_code=404, detail="Папка не найдена")

    if folder.public == False and folder.user_id != user.id:
        raise HTTPException(status_code=403, detail="Папка принадлежит не вам")

    return folder

@app.post("/folder/{folder_id}", response_model=schemas.Folder)
async def update_folder(
    folder_id: int,
    folder_data: schemas.FolderCreate,
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    Authorize.jwt_required()
    user_id = Authorize.get_jwt_subject()
    user = await crud.get_user_by_id(session, user_id)

    if user.role == 1:
        folder_data.public = False

    folder = await crud.check_folder_exists(session, user_id=user.id, folder_name=folder_data.name)

    if folder and folder.id != folder_id:
        raise HTTPException(status_code=400, detail="Папка с таким названием уже существует")

    folder = await crud.update_folder(session, folder_id=folder_id, folder_name=folder_data.name, folder_public=folder_data.public)

    if folder is None:
        raise HTTPException(status_code=404, detail="Папка не найдена")

    return folder


@app.delete("/folder/{folder_id}")
async def delete_folder(
    folder_id: int,
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    Authorize.jwt_required()
    user_id = Authorize.get_jwt_subject()
    user = await crud.get_user_by_id(session, user_id)

    folder = await crud.get_folder(session, folder_id)

    if folder is None:
        raise HTTPException(status_code=404, detail="Папка не найдена")

    if folder.user_id != user.id:
        raise HTTPException(status_code=403, detail="Папка принадлежит не вам")

    await crud.delete_folder(session, folder_id=folder.id)

    return True


@app.post("/folder/{folder_id}/bonds/{bond_id}")
async def add_bond_to_folder(
    folder_id: int,
    bond_id: int,
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends(),
):
    Authorize.jwt_required()
    user_id = Authorize.get_jwt_subject()
    user = await crud.get_user_by_id(session, user_id)

    folder = await crud.get_folder(session, folder_id)

    if folder is None:
        raise HTTPException(status_code=404, detail="Папка не найдена")

    if folder.user_id != user.id:
        raise HTTPException(status_code=403, detail="Папка принадлежит не вам")

    bond = await crud.get_bond_by_id(session, bond_id)

    if bond is None:
        raise HTTPException(status_code=404, detail="Облигация не найдена")

    await crud.add_bond_to_folder(session, folder_id=folder.id, bond_id=bond.id)

    return True


@app.delete("/folder/{folder_id}/bonds/{bond_id}")
async def remove_bond_from_folder(
    folder_id: int,
    bond_id: int,
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    Authorize.jwt_required()
    user_id = Authorize.get_jwt_subject()
    user = await crud.get_user_by_id(session, user_id)

    folder = await crud.get_folder(session, folder_id)

    if folder is None:
        raise HTTPException(status_code=404, detail="Папка не найдена")

    if folder.user_id != user.id:
        raise HTTPException(status_code=403, detail="Папка принадлежит не вам")

    bond = await crud.get_bond_by_id(session, bond_id)

    if bond is None:
        raise HTTPException(status_code=404, detail="Облигация не найдена")

    await crud.remove_bond_from_folder(session, folder_id=folder.id, bond_id=bond.id)

    return True


@app.post("/batch/{bond_id}")
async def add_bond_to_folders(
    bond_id: int,
    folders_data: schemas.FoldersList,
    session: Session = Depends(get_session),
    Authorize: AuthJWT = Depends()
):
    Authorize.jwt_required()
    user_id = Authorize.get_jwt_subject()
    user = await crud.get_user_by_id(session, user_id)

    bond = await crud.get_bond_by_id(session, bond_id)

    if bond is None:
        raise HTTPException(status_code=404, detail="Облигация не найдена")

    for folder_id in folders_data.folders:

        folder = await crud.get_folder(session, folder_id)

        if folder is None:
            continue

        if folder.user_id == user.id:
            await crud.add_bond_to_folder(session, folder_id=folder.id, bond_id=bond.id)

    return True