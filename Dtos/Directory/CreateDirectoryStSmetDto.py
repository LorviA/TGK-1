from pydantic import BaseModel
from typing import Optional

class CreateDirectoryStSmetDto(BaseModel):
    st: Optional[str] = None
    description: Optional[str] = None
    is_group: Optional[bool] = None