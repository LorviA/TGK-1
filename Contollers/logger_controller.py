from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, Dict
from Models.Logger import Logger
from Dtos.User.CreateUserDto import CreateUserDto
from Models.UserUpdate import UserUpdate
from Repository.LoggerRepository import LoggerRepository
from Services.user_service import UserService
from DataBase.base import get_db
from typing import List

router = APIRouter(prefix="/loggers", tags=["loggers"])

@router.get("/", response_model=List[Logger])  # Возвращаем список пользователей
def get_all_loggs(
    db: Session = Depends(get_db)
):
    logger_repository = LoggerRepository(db)
    return logger_repository.get_all_loggs()