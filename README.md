# Movie Match

Movie Match is a full-stack web application that helps a group choose a movie together. Users create an account, select their movie preferences, create or join a lobby, and swipe through recommendations. The application reports a match based on the group's votes.

## Features

- User registration and JWT-based authentication
- Movie genre and decade preferences
- Group lobbies with shareable join codes
- Movie recommendations and search powered by TMDB
- Swipe-based voting
- Perfect and partial group-match detection
- Local SQLite database

## Technology stack

- **Frontend:** React 19, React Router, Vite, React Tinder Card
- **Backend:** Python 3.10, FastAPI, SQLAlchemy, Uvicorn
- **Database:** SQLite
- **External API:** The Movie Database (TMDB)
- **Development environment:** Docker and Docker Compose

## Project structure

```text
.
├── backend/              # FastAPI application, models, routes, and SQLite data
│   ├── app/
│   │   ├── api/          # API routes and authentication dependencies
│   │   ├── core/         # Database, security, and TMDB integration
│   │   ├── models/       # SQLAlchemy models
│   │   └── schemas/      # Request and response schemas
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/             # React/Vite client
│   ├── src/
│   │   └── pages/        # Login, registration, lobby, questions, and swipe pages
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml    # Runs the backend and frontend together
└── run.sh                # Project startup script
```

## Prerequisites

Install the following software:

- [Docker](https://docs.docker.com/engine/install/)
- Docker Compose v2 (`docker compose`) or the legacy `docker-compose` command
- A [TMDB API Read Access Token](https://developer.themoviedb.org/docs/getting-started)

Make sure the Docker daemon is running before starting the application.

## Setup and run

1. Clone the repository and enter its directory:

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Create the backend environment file:

   ```bash
   cp backend/.env.example backend/.env
   ```

3. Open `backend/.env` and replace the placeholder values. Generate a strong JWT secret, for example with `openssl rand -hex 32`, and add your TMDB Read Access Token.

4. Make the startup script executable and run it:

   ```bash
   chmod +x run.sh
   ./run.sh
   ```

The first run can take a few minutes while Docker builds the images and installs dependencies.

## Application URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Interactive API documentation: http://localhost:8000/docs

Press `Ctrl+C` to stop the foreground process. To remove the running containers afterwards, use:

```bash
docker compose down
```

If your system uses legacy Compose, run `docker-compose down` instead.

## Environment variables

The backend reads these values from `backend/.env`:

| Variable | Purpose | Suggested value |
| --- | --- | --- |
| `SECRET_KEY` | Signs and verifies JWT access tokens | A long random string |
| `ALGORITHM` | JWT signing algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access-token lifetime in minutes | `60` |
| `TMDB_ACCESS_TOKEN` | TMDB API Read Access Token | Your TMDB token |

Do not commit `backend/.env`; it contains secrets and is ignored by Git.

## Data persistence

The backend stores data in `backend/app.db`. Docker mounts the local `backend` directory into the container, so the database remains available between restarts. Delete this file only if you intentionally want to reset all local users, lobbies, and votes.

## Run without Docker (optional)

Backend, from the project root:

```bash
python3 -m venv backend/venv
source backend/venv/bin/activate
pip install -r backend/requirements.txt
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

In another terminal, run the frontend:

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev -- --host 0.0.0.0 --port 5173
```
