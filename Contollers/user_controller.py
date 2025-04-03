from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from Models.User import User
from Dtos.User.CreateUserDto import CreateUserDto
from Models.UserUpdate import UserUpdate
from Repository.UserRepository import UserRepository
from Services.user_service import UserService
from DataBase.base import get_db
from typing import List

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=User)
def create_user(
    user: CreateUserDto,
   db: Session = Depends(get_db)
):
    user_repository = UserRepository(db)
    user_service = UserService(user_repository)
    return user_service.create_user(user)

@router.get("/{user_id}", response_model=User)
def read_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    user_repository = UserRepository(db)
    user_service = UserService(user_repository)
    db_user = user_service.get_user(user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.get("/", response_model=List[User])  # Возвращаем список пользователей
def get_all_users(
    db: Session = Depends(get_db)
):
    """Получить список всех пользователей"""
    user_repository = UserRepository(db)
    return user_repository.get_all_users()


@router.patch("/{user_id}", response_model=User)
def update_user(
        user_id: int,
        update_data: UserUpdate,
        db: Session = Depends(get_db)
):
    """
    Обновляет данные пользователя

    Поддерживает частичное обновление (PATCH)
    """

    user_repository = UserRepository(db)
    updated_user = user_repository.update_user(user_id, update_data.dict(exclude_unset=True))

    if not updated_user:
        raise HTTPException(
            status_code=404,
            detail="Пользователь не найден"
        )

    return updated_user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
        user_id: int,
        db: Session = Depends(get_db)
):
    """
    Удаление пользователя по ID

    Возвращает 204 при успехе или 404 если пользователь не найден
    """
    user_repository = UserRepository(db)
    success, message = user_repository.delete_user(user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=message
        )
    return None  # 204 No Content

