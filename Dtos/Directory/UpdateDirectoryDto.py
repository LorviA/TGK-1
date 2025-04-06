from pydantic import BaseModel, validator
from typing import List, Optional
import json

class UpdateDirectoryDto(BaseModel):
    name: Optional[str] = None
    value: Optional[List[str]] = None  # Теперь только массив строк

    @validator('value', pre=True)
    def parse_value(cls, v):
        if v is None:
            return None
        if isinstance(v, list):
            return [str(item) for item in v]  # Все элементы к строке
        if isinstance(v, str):
            try:
                parsed = json.loads(v)
                if isinstance(parsed, list):
                    return [str(item) for item in parsed]
                return [str(parsed)]
            except json.JSONDecodeError:
                return [v]  # Если не JSON, создаем массив из строки
        return [str(v)]  # Все остальное преобразуем в массив строк