from pydantic import BaseModel
from typing import Union, List, Dict


class Directory(BaseModel):
    id: int
    name: str
    value: Union[str, List[str], Dict]  # Теперь принимает строку, список или словарь

    class Config:
        from_attributes = True