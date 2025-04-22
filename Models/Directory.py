from pydantic import BaseModel
from typing import Optional
from datetime import date
class DirectoryConfidentialityOfInformation(BaseModel):
    id: int
    name: str
    is_archived: bool = False
    expiration_date: Optional[date] = None  # Добавлено

    class Config:
        from_attributes = True

class DirectoryStSmet(BaseModel):
    id: int
    st: str
    description: str
    is_group: bool
    is_archived: bool = False
    expiration_date: Optional[date] = None  # Добавлено

    class Config:
        from_attributes = True