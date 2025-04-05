from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from Models.DIRECTORY import Directory
from Models.entities import DirectoryDB
from Dtos.Directory.CreateDirectoryDto import CreateDirectoryDto
from Dtos.Directory.UpdateDirectoryDto import UpdateDirectoryDto
from Repository.DirectoryRepository import DirectoryRepository
from Services.directory_service import DirectoryService
from DataBase.base import get_db
from typing import List

router = APIRouter(prefix="/directories", tags=["directories"])

@router.post("/", response_model=Directory, status_code=status.HTTP_201_CREATED)
def create_directory(
        directory: CreateDirectoryDto,
        db: Session = Depends(get_db)
):
    directory_repository = DirectoryRepository(db)
    directory_service = DirectoryService(directory_repository)
    return directory_service.create_directory(directory)


@router.get("/{directory_id}", response_model=Directory)
def get_directory(
        directory_id: int,
        db: Session = Depends(get_db)
):
    directory_repository = DirectoryRepository(db)
    directory_service = DirectoryService(directory_repository)
    db_directory = directory_service.get_directory(directory_id)
    if not db_directory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Справочник не найден"
        )
    return db_directory


@router.get("/", response_model=List[Directory])
def get_all_directories(
        db: Session = Depends(get_db)
):
    directory_repository = DirectoryRepository(db)
    directory_service = DirectoryService(directory_repository)
    return directory_service.get_all_directories()


@router.patch("/{directory_id}", response_model=Directory)
def update_directory(
        directory_id: int,
        update_data: UpdateDirectoryDto,
        db: Session = Depends(get_db)
):
    directory_repository = DirectoryRepository(db)
    directory_service = DirectoryService(directory_repository)
    updated_directory = directory_service.update_directory(
        directory_id,
        update_data
    )
    if not updated_directory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Справочник не найден"
        )
    return updated_directory


@router.delete("/{directory_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_directory(
        directory_id: int,
        db: Session = Depends(get_db)
):
    directory_repository = DirectoryRepository(db)
    directory_service = DirectoryService(directory_repository)
    success = directory_service.delete_directory(directory_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Справочник не найден"
        )
    return None