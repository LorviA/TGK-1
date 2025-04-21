from pydantic import BaseModel
from typing import Optional

class UpdateDirectoryConfidentialityOfInformationDto(BaseModel):
    name: Optional[str] = None
    user_id: Optional[int] = None