from pydantic import BaseModel

class DirectoryConfidentialityOfInformation(BaseModel):
    __tablename__ = 'ConfidentianalityOfInformation'

    id: int
    name: str

    class Config:
        from_attributes = True


class DirectoryStSmet(BaseModel):
    __tablename__ = 'StSmet'

    id: int
    st: str
    description: str
    is_group: bool

    class Config:
        from_attributes = True


