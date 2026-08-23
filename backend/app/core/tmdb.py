import os
import requests
from dotenv import load_dotenv

load_dotenv()

TMDB_ACCESS_TOKEN = os.getenv("TMDB_ACCESS_TOKEN")
TMDB_BASE_URL = "https://api.themoviedb.org/3"

HEADERS = {
    "Authorization": f"Bearer {TMDB_ACCESS_TOKEN}",
    "accept": "application/json"
}

def _get(path: str, params: dict):
    if not TMDB_ACCESS_TOKEN:
        raise RuntimeError("TMDB_ACCESS_TOKEN is not configured")

    response = requests.get(
        f"{TMDB_BASE_URL}{path}",
        params=params,
        headers=HEADERS,
        timeout=10
    )
    response.raise_for_status()
    return response.json()

def discover_movies(
    release_date_gte: str | None = None,
    release_date_lte: str | None = None,
    genres_or: str | None = None,
    page: int = 1
):
    params = {
        "language": "en-Us",
        "include_adult": False,
        "sort_by": "popularity.desc",
        "page": page
    }

    if release_date_gte is not None:
        params["primary_release_date.gte"] = release_date_gte

    if release_date_lte is not None:
        params["primary_release_date.lte"] = release_date_lte

    if genres_or is not None:
        params["with_genres"] = genres_or

    return _get("/discover/movie", params)

def search_movies(query: str, page: int = 1):
    return _get(
        "/search/movie",
        {
            "query": query,
            "language": "ro-RO",
            "include_adult": False,
            "page": page
        }
    )

def get_movie_genres():
    return _get(
        "/genre/movie/list",
        {"language": "ro-RO"}
    )