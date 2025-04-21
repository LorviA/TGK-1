from pydantic import BaseModel
from datetime import date

class Logger(BaseModel):
    id:int
    user_id:int
    message:str
    date_change:date