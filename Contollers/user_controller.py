from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from Models.User import User
from Dtos.User.CreateUserDto import CreateUserDto
from Repository.UserRepository import UserRepository
from Services.user_service import UserService
from DataBase.base import get_db

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=User)
def create_user(
    user: CreateUserDto,
   db: Session = Depends(get_db)
):
    user_repository = UserRepository(db)
    user_service = UserService(user_repository)
    return user_service.create_user(user)

