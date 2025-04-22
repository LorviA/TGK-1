from pydantic import BaseModel
from datetime import date

class SetDirectoryExpirationDateDto(BaseModel):
    expiration_date: date