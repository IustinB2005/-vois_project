from pydantic import BaseModel, EmailStr
from typing import Literal, List

# Variantele permise
DecadeType = Literal["1970-1980", "1980-1990", "1990-2000", "2000-2010", "2010-2020", "2020+"]
GenreType = Literal["Actiune", "Comedie", "Drama", "Horror", "Romantic", "SF"]

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    # Acum îi spunem clar că așteaptă O LISTĂ de decenii și genuri
    preferred_decade: List[DecadeType]
    preferred_genre: List[GenreType]

class UserLogin(BaseModel):
    email: EmailStr
    password: str