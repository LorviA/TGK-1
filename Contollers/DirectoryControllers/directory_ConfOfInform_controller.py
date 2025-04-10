from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from Models.Directory import DirectoryConfidentialityOfInformation as Directories
from Dtos.Directory.CreateDirectoryConfidentialityOfInformationDto import CreateDirectoryConfidentialityOfInformationDto
from Dtos.Directory.UpdateDirectoryConfidentialityOfInformationDto import UpdateDirectoryConfidentialityOfInformationDto
from Repository.DirectoryRepository.DirectoryConfidentialityOfInformationRepository import DirectoryRepository
from Services.directory_service import DirectoryService
from DataBase.base import get_db
from typing import List



router = APIRouter(prefix="/DirectoriesConfidentialityOfInformation", tags=["DirectoriesConfidentialityOfInformation"])

def get_directory_service(db: Session = Depends(get_db)) -> DirectoryService:
    return DirectoryService(DirectoryRepository(db))

@router.post("/", response_model=Directories)
def create_directory(
    directory: CreateDirectoryConfidentialityOfInformationDto,
    service: DirectoryService = Depends(get_directory_service)
):
    try:
        return service.create_directory(directory)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
@router.get("/{directory_id}", response_model=Directories)
def get_directory(
    directory_id: int,
    service: DirectoryService = Depends(get_directory_service)
):
    db_directory = service.get_directory(directory_id)
    if not db_directory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Справочник не найден"
        )
    return db_directory

@router.get("/", response_model=List[Directories])
def get_all_directories(
    service: DirectoryService = Depends(get_directory_service)
):
    return service.get_all_directories()


@router.patch("/{directory_id}", response_model=Directories)
async def update_directory(
    directory_id: int,
    update_data: UpdateDirectoryConfidentialityOfInformationDto,
    service: DirectoryService = Depends(get_directory_service)
):
    updated_directory = service.update_directory(directory_id, update_data)
    if not updated_directory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Запись справочника не найдена"
        )
    return updated_directory

@router.delete("/{directory_id}")
def delete_directory(
    directory_id: int,
    service: DirectoryService = Depends(get_directory_service)
):
    success = service.delete_directory(directory_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Справочник не найден"
        )
    return None