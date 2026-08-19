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
from app.models.lobby import Lobby, Vote
from app.schemas.lobby import LobbyOut, LobbyJoin,VoteCreate

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




TMDB_GENRES_MAP = {
    "Actiune": "28",
    "Comedie": "35",
    "Drama": "18",
    "Horror": "27",
    "Romantic": "10749",
    "SF": "878"
}

DECADE_STARTS_MAP = {
    "1970-1980": "1970-01-01",
    "1980-1990": "1980-01-01",
    "1990-2000": "1990-01-01",
    "2000-2010": "2000-01-01",
    "2010-2020": "2010-01-01",
    "2020+": "2020-01-01"
}








@router.post("/lobby/{code}/start")
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

# 2. Agregarea preferintelor (Intersectie / Reuniune)
    unique_genres = set()
    oldest_date = "2099-01-01" # O data default in caz ca e ceva in neregula

    for user in lobby.users:
        # Adaugam genul tradus in set pt a elimina duplicatele
        if user.preferred_genre in TMDB_GENRES_MAP:
            unique_genres.add(TMDB_GENRES_MAP[user.preferred_genre])
        
        # Gasim cel mai vechi an ales de grup
        if user.preferred_decade in DECADE_STARTS_MAP:
            user_date = DECADE_STARTS_MAP[user.preferred_decade]
            if user_date < oldest_date:
                oldest_date = user_date

    # 3. Pregatim datele pentru TMDB
    # Daca avem genuri, le lipim cu "|" (ex: "28|35"). Daca nu, lasam None.
    genres_or_string = "|".join(unique_genres) if unique_genres else None
    
    # 4. Apelam functia din core/tmdb.py
    tmdb_response = discover_movies(
        release_date_gte=oldest_date,
        genres_or=genres_or_string
    )


    lobby.status = "matching"
    db.commit()
    db.refresh(lobby)

    return {
        "message": "Lobby-ul a inceput",
        "lobby_status": lobby.status,
        "movies": tmdb_response.get("results", [])
    }

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



@router.post("/lobby/{code}/swipe")
def swipe_movie(
    code: str,
    vote_data: VoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lobby = db.query(Lobby).filter(Lobby.code == code.upper()).first()
    if not lobby:
        raise HTTPException(status_code=404, detail="Cod invalid")

    # 1. Salvam votul in baza de date
    new_vote = Vote(
        lobby_id=lobby.id,
        user_id=current_user.id,
        movie_id=vote_data.movie_id,
        is_like=vote_data.is_like
    )
    db.add(new_vote)
    db.commit()

    # 2. Luam toate voturile date pentru ACEST film in ACEST lobby
    movie_votes = db.query(Vote).filter(
        Vote.lobby_id == lobby.id,
        Vote.movie_id == vote_data.movie_id
    ).all()

    total_users = len(lobby.users)
    total_votes = len(movie_votes)

    # Daca nu au votat toti, nu calculam nimic inca
    if total_votes < total_users:
        return {"status": "waiting", "message": "Vot inregistrat. Asteptam restul grupului."}

    # 3. Au votat toti! Calculam pragul.
    likes = sum(1 for v in movie_votes if v.is_like)
    ratio = likes / total_users

    # Cazul 1: 100% Perfect Match
    if ratio == 1.0:
        return {
            "status": "perfect_match",
            "movie_id": vote_data.movie_id,
            "message": "Perfect Match! Toti au dat Like."
        }
    
    # Cazul 2: >= 70% Partial Match
    elif ratio >= 0.7:
        return {
            "status": "partial_match",
            "movie_id": vote_data.movie_id,
            "message": f"Partial Match! {int(ratio * 100)}% au dat Like."
        }
    
    # Cazul 3: Sub 70% (Prea multe Pass-uri)
    else:
        return {
            "status": "failed",
            "movie_id": vote_data.movie_id,
            "message": "Filmul a picat testul. Treceti la urmatorul."
        }