from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from Models.Directory import Directory as Directories
from Dtos.Directory.CreateDirectoryDto import CreateDirectoryDto
from Dtos.Directory.UpdateDirectoryDto import UpdateDirectoryDto
from Repository.DirectoryRepository import DirectoryRepository
from Services.directory_service import DirectoryService
from DataBase.base import get_db
from typing import List, Dict, Any,Optional
import json


router = APIRouter(prefix="/directories", tags=["directories"])

# Инициализация зависимостей
def get_directory_service(db: Session = Depends(get_db)) -> DirectoryService:
    return DirectoryService(DirectoryRepository(db))

@router.post("/", response_model=Directories)
async def create_directory(
    directory: CreateDirectoryDto,
    service: DirectoryService = Depends(get_directory_service)
):
    """Создание нового справочника"""
    try:
        return service.create_directory(directory)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/", response_model=List[Directories])
async def get_all_directories(
    service: DirectoryService = Depends(get_directory_service)
):
    """Получение всех справочников"""
    return service.get_all_directories()

@router.get("/{directory_id}", response_model=Directories)
async def get_directory(
    directory_id: int,
    service: DirectoryService = Depends(get_directory_service)
):
    """Получение справочника по ID"""
    db_directory = service.get_directory(directory_id)
    if not db_directory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Справочник не найден"
        )
    return db_directory

@router.get("/", response_model=List[Directories])
async def get_all_directories(
    service: DirectoryService = Depends(get_directory_service)
):
    """Получение всех справочников"""
    return service.get_all_directories()


@router.patch("/{directory_id}", response_model=Directories)
async def update_directory(
        directory_id: int,
        update_data: UpdateDirectoryDto,
        service: DirectoryService = Depends(get_directory_service)
):
    """Обновление справочника с полной поддержкой JSON"""
    # Преобразуем Pydantic модель в dict
    update_dict = update_data.dict(exclude_unset=True)

    updated_directory = service.update_directory(directory_id, update_dict)
    if not updated_directory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Справочник не найден"
        )
    return updated_directory

@router.delete("/{directory_id}")
async def delete_directory(
    directory_id: int,
    service: DirectoryService = Depends(get_directory_service)
):
    """Удаление справочника"""
    success = service.delete_directory(directory_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Справочник не найден"
        )
    return None