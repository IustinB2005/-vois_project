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


def search_movies(query: str):

    response = requests.get(
        f"{TMDB_BASE_URL}/search/movie",
        params={
            "query": query,
            "language": "ro-RO"
        },
        headers=HEADERS
    )

    response.raise_for_status()

    return response.json()


def discover_movies(
    year: int | None = None,
    genre: int | None = None
):

    params = {
        "language": "ro-RO",
        "sort_by": "popularity.desc"
    }

    if year is not None:
        params["primary_release_year"] = year

    if genre is not None:
        params["with_genres"] = genre

    response = requests.get(
        f"{TMDB_BASE_URL}/discover/movie",
        params=params,
        headers=HEADERS
    )

    response.raise_for_status()

    return response.json()


def get_movie_genres():

    response = requests.get(
        f"{TMDB_BASE_URL}/genre/movie/list",
        params={
            "language": "ro-RO"
        },
        headers=HEADERS
    )

    response.raise_for_status()

    return response.json()


def search_movies(query: str):

    response = requests.get(
        f"{TMDB_BASE_URL}/search/movie",
        params={
            "query": query,
            "language": "ro-RO"
        },
        headers=HEADERS
    )

    response.raise_for_status()

    return response.json()