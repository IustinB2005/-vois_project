from pydantic import BaseModel, EmailStr
from typing import Literal,Optional

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    # Utilizatorul va fi fortat sa aleaga exact UNA din aceste 6 variante:
    preferred_decade: Optional[Literal["1970-1980", "1980-1990", "1990-2000", "2000-2010", "2010-2020", "2020+"]] = None
    preferred_genre: Optional[Literal["Actiune", "Comedie", "Drama", "Horror", "Romantic", "SF"]] = None
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserPreferencesUpdate(BaseModel):
    preferred_decade: Optional[Literal["1970-1980", "1980-1990", "1990-2000", "2000-2010", "2010-2020", "2020+"]] = None
    preferred_genre: Optional[Literal["Actiune", "Comedie", "Drama", "Horror", "Romantic", "SF"]] = None