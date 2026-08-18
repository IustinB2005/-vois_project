from fastapi import HTTPException
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.security import hash_password
from app.core.security import verify_password
from app.core.security import create_access_token
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin
from app.api.dependencies import get_current_user
from fastapi.security import OAuth2PasswordRequestForm
from app.models.lobby import Lobby
from app.schemas.lobby import LobbyOut, LobbyJoin
from app.core.tmdb import (
    search_movies,
    discover_movies,
    get_movie_genres
)

router = APIRouter()



import random
import string

def generate_lobby_code(db: Session, length: int = 5) -> str:
    characters = string.ascii_uppercase + string.digits
    while True:
        code = "".join(random.choices(characters, k=length))
        exists = db.query(Lobby).filter(Lobby.code == code).first()
        if not exists:
            return code

@router.post("/lobby/create", response_model=LobbyOut)
def create_lobby(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    code = generate_lobby_code(db)

    new_lobby = Lobby(
        code=code,
        status="waiting",
        host_id=current_user.id
    )
    db.add(new_lobby)
    db.commit()
    db.refresh(new_lobby)

    current_user.lobby_id = new_lobby.id
    db.commit()

    return new_lobby

@router.post("/lobby/join", response_model=LobbyOut)
def join_lobby(
    lobby_data: LobbyJoin,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lobby = db.query(Lobby).filter(Lobby.code == lobby_data.code.upper()).first()

    if lobby is None:
        raise HTTPException(status_code=404, detail="Cod invalid")

    if lobby.status != "waiting":
        raise HTTPException(status_code=400, detail="Lobby-ul a inceput deja")

    current_user.lobby_id = lobby.id
    db.commit()
    db.refresh(lobby)

    return lobby

@router.get("/lobby/{code}/status", response_model=LobbyOut)
def lobby_status(
    code: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lobby = db.query(Lobby).filter(Lobby.code == code.upper()).first()

    if lobby is None:
        raise HTTPException(status_code=404, detail="Cod invalid")

    return lobby

@router.post("/lobby/{code}/start", response_model=LobbyOut)
def start_lobby(
    code: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lobby = db.query(Lobby).filter(Lobby.code == code.upper()).first()

    if lobby is None:
        raise HTTPException(status_code=404, detail="Cod invalid")

    if lobby.host_id != current_user.id:
        raise HTTPException(status_code=403, detail="Doar host-ul poate porni lobby-ul")

    if len(lobby.users) < 2:
        raise HTTPException(status_code=400, detail="Ai nevoie de cel putin 2 membri")

    lobby.status = "matching"
    db.commit()
    db.refresh(lobby)

    return lobby

@router.post("/register")
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    new_user = User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password),
        preferred_decade=user.preferred_decade,
        preferred_genre=user.preferred_genre
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "id": new_user.id,
        "username": new_user.username,
        "email": new_user.email,
        "preferred_decade": new_user.preferred_decade,
        "preferred_genre": new_user.preferred_genre
    }


@router.get("/users")
def get_users(
    db: Session = Depends(get_db)
):

    users = db.query(User).all()

    return users

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    db.delete(user)
    db.commit()

    return {
        "message": "User deleted"
    }


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(
        User.email == form_data.username
    ).first()


    if db_user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    if not verify_password(
        form_data.password,
        db_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Incorrect password"
        )


    access_token = create_access_token(
        data={
            "sub": db_user.email
        }
    )


    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user)
):

    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email
    }


@router.get("/movies")
def get_movies(
    year: int | None = None,
    genre: int | None = None,
    current_user: User = Depends(get_current_user)
):
    return discover_movies(
        year=year,
        genre=genre
    )


@router.get("/movies/genres")
def get_genres(
    current_user: User = Depends(get_current_user)
):
    return get_movie_genres()

@router.get("/movies/search")
def search_movie(
    name: str,
    current_user: User = Depends(get_current_user)
):
    return search_movies(name)