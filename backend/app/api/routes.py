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
from app.schemas.lobby import LobbyOut, LobbyJoin,SwipeAction
from app.models.vote import Vote



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


def aggregate_lobby_preferences(users):
    """Adună toate preferințele membrilor din cameră și elimină duplicatele."""
    all_decades = set()
    all_genres = set()
    
    for user in users:
        if user.preferred_decade:
            all_decades.update(user.preferred_decade)
        if user.preferred_genre:
            all_genres.update(user.preferred_genre)
            
    return list(all_decades), list(all_genres)

def fetch_movies_from_tmdb(decades: list, genres: list):
    """
    MOCKUP: Momentan returnează 20 de filme de test. 
    Aici vom pune codul real de conectare la API-ul TMDB mai târziu.
    """
    movies = []
    for i in range(1, 21):
        movies.append({
            "movie_id": i * 100, # ID simulat de TMDB
            "title": f"Filmul generat {i}",
            "poster_url": "link_catre_poza.jpg",
            "match_reasons": {"decades": decades[:1], "genres": genres[:2]}
        })
    return movies

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

# 1. Schimbăm statusul
    lobby.status = "matching"
    db.commit()
    db.refresh(lobby)

    # 2. Agregăm preferințele grupului
    decades, genres = aggregate_lobby_preferences(lobby.users)

    # 3. Cerem cele 20 de filme (Momentan din funcția mock, mai târziu din TMDB)
    movies_to_swipe = fetch_movies_from_tmdb(decades, genres)

    # 4. Returnăm aplicației de pe telefon lista exactă
    return {
        "lobby_status": lobby.status,
        "total_members": len(lobby.users),
        "movies": movies_to_swipe
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
    swipe_data: SwipeAction,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Găsim camera
    lobby = db.query(Lobby).filter(Lobby.code == code.upper()).first()
    if not lobby:
        raise HTTPException(status_code=404, detail="Cod invalid")

    # 2. Verificăm dacă utilizatorul a mai votat pentru acest film
    existing_vote = db.query(Vote).filter(
        Vote.user_id == current_user.id,
        Vote.lobby_id == lobby.id,
        Vote.movie_id == swipe_data.movie_id
    ).first()

    # Dacă a mai votat, actualizăm votul, dacă nu, creăm unul nou
    if existing_vote:
        existing_vote.is_like = swipe_data.is_like
    else:
        new_vote = Vote(
            user_id=current_user.id,
            lobby_id=lobby.id,
            movie_id=swipe_data.movie_id,
            is_like=swipe_data.is_like
        )
        db.add(new_vote)
    db.commit()

    # 3. ALGORITMUL TĂU ACTUALIZAT: Calculăm matematica DOAR după ce au votat toți
    total_members = len(lobby.users)
    
    # Numărăm câte voturi (și bune și rele) are filmul în total până acum
    total_votes_for_movie = db.query(Vote).filter(
        Vote.lobby_id == lobby.id,
        Vote.movie_id == swipe_data.movie_id
    ).count()

    # Dacă NU au votat absolut toți, oprim execuția aici și așteptăm
    if total_votes_for_movie < total_members:
        return {
            "status": "pending",
            "movie_id": swipe_data.movie_id,
            "message": f"Vot salvat. Au votat {total_votes_for_movie} din {total_members} membri."
        }

    # === DACA SERVERUL A AJUNS AICI, INSEAMNA CA AU VOTAT TOTI ===

    # Acum numărăm câte Like-uri au fost în total
    likes_count = db.query(Vote).filter(
        Vote.lobby_id == lobby.id,
        Vote.movie_id == swipe_data.movie_id,
        Vote.is_like == True
    ).count()

    # Calculăm procentul final
    match_percentage = likes_count / total_members

    # CAZUL 1: 100% Perfect Match (Toată lumea a dat Like)
    if match_percentage == 1.0:
        lobby.status = "perfect_match"
        db.commit()
        return {
            "status": "perfect_match",
            "movie_id": swipe_data.movie_id,
            "message": "100% Match! Acest film a castigat în unanimitate."
        }
    
    # CAZUL 2: >= 70% Partial Match
    elif match_percentage >= 0.7:
        lobby.status = "partial_match"
        db.commit()
        return {
            "status": "partial_match",
            "movie_id": swipe_data.movie_id,
            "message": f"Match {int(match_percentage * 100)}%! Vreti sa il vizionati pe acesta sau continuati?"
        }

    # CAZUL 3: Respingere (Prea multe Pass-uri, sub 70%)
    else:
        return {
            "status": "failed",
            "movie_id": swipe_data.movie_id,
            "message": "Filmul a fost respins de grup (nu a strâns 70% din voturi)."
        }