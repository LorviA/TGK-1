from sqlalchemy.orm import Session
from typing import List
from DataBase.base import get_db
from Interfaces.IUserRepository import IUserRepository
from Models.entities import User, Logger
from typing import Optional
from typing import Tuple
from fastapi import APIRouter, Query, Depends
from typing import Optional, Dict
from sqlalchemy import asc, desc
from datetime import date

class LoggerRepository():
    def __init__(self, db: Session):
        self.db = db

    def get_all_loggs(self) -> List[User]:
        return self.db.query(Logger).all()