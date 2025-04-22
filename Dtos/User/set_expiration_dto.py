from pydantic import BaseModel
from datetime import date

class SetExpirationDateDto(BaseModel):
    expiration_date: date