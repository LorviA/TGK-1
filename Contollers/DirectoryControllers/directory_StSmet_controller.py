from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from Models.Directory import DirectoryStSmet as Directories
from Dtos.Directory.CreateDirectoryStSmetDto import CreateDirectoryStSmetDto
from Dtos.Directory.UpdateDirectoryStSmetDto import UpdateDirectoryStSmetDto
from Repository.DirectoryRepository.DirectoryStSmetRepository import DirectoryRepository
from Services.directory_StSmet_services import DirectoryService
from DataBase.base import get_db
from typing import List
from Dtos.Directory.ArchiveDirectory import ArchiveDirectoryDto
from Dtos.Directory.SetDirectoryExpirationDateDto import SetDirectoryExpirationDateDto
router = APIRouter(prefix="/DirectoriesStSmet", tags=["DirectoriesStSmet"])

def get_directory_service(db: Session = Depends(get_db)) -> DirectoryService:
    return DirectoryService(DirectoryRepository(db))

@router.post("/", response_model=Directories)
def create_directory(
    directory: CreateDirectoryStSmetDto,
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
    update_data: UpdateDirectoryStSmetDto,
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

@router.patch("/archive/{directory_id}")
def archive_directory(
    directory_id: int,
    archive_data: ArchiveDirectoryDto,
    service: DirectoryService = Depends(get_directory_service)
):
    updated = service.archive_directory(directory_id, archive_data.is_archived)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Справочник не найден"
        )
    return updated
@router.post("/set-expiration/")
def set_directories_expiration(
    dto: SetDirectoryExpirationDateDto,
    service: DirectoryService = Depends(get_directory_service)
):
    result = service.set_expiration_for_all(dto.expiration_date)
    return result

@router.post("/archive-expired/")
def archive_expired_directories(
    db: Session = Depends(get_db)
):
    service = get_directory_service(db)
    archived_count = service.archive_expired()
    return {"message": f"В архив переведено справочников: {archived_count}"}

@router.get("/archived/", response_model=List[Directories])
def get_archived_directories(
    service: DirectoryService = Depends(get_directory_service)
):
    """Получить все архивные записи справочника"""
    return service.get_archived_directories()