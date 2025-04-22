from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, Dict
from Models.User import User
from Dtos.User.CreateUserDto import CreateUserDto
from Models.UserUpdate import UserUpdate
from Repository.UserRepository import UserRepository
from Services.user_service import UserService
from DataBase.base import get_db
from typing import List
from Models.entities import User as UserModel
from datetime import date
from Dtos.User.set_expiration_dto import SetExpirationDateDto

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


@router.get("/by-username/{user_name}", response_model=User)
def get_user_by_username(user_name: str,db: Session = Depends(get_db)):
    """
    Получение пользователя по логину

    Возвращает:
        - 200 с данными пользователя если найден
        - 404 если пользователь не существует
    """
    user_repository = UserRepository(db)
    user = user_repository.get_user_by_username(user_name)
    if not user:
        raise HTTPException(
            status_code=404,
            detail=f"Пользователь с логином '{user_name}' не найден"
        )
    return user

@router.post("/users/set-expiration/")
def set_users_expiration(dto: SetExpirationDateDto, db: Session = Depends(get_db)):
    users = db.query(UserModel).all()
    for user in users:
        user.expiration_date = dto.expiration_date
    db.commit()
    return {"message": f"Дата архивирования {dto.expiration_date} установлена для {len(users)} пользователей"}

@router.post("/archive-expired/")
def archive_expired_users(db: Session = Depends(get_db)):
    today = date.today()
    users = db.query(UserModel).filter(
        UserModel.expiration_date != None,
        UserModel.expiration_date <= today,
        UserModel.rights != 4
    ).all()

    for user in users:
        if user.rights != 1:
            user.rights = 4  # Архивный пользователь
    db.commit()
    return {"message": f"В архив переведено пользователей: {len(users)}"}