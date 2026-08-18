from pydantic import BaseModel, EmailStr
from typing import Literal

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    # Utilizatorul va fi fortat sa aleaga exact UNA din aceste 6 variante:
    preferred_decade: Literal["1970-1980", "1980-1990", "1990-2000", "2000-2010", "2010-2020", "2020+"]
    preferred_genre: Literal["Actiune", "Comedie", "Drama", "Horror", "Romantic", "SF"]

class UserLogin(BaseModel):
    email: EmailStr
    password: str