#!/usr/bin/env bash

set -Eeuo pipefail

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$PROJECT_DIR/backend/.env"

if ! command -v docker >/dev/null 2>&1; then
    echo "Error: Docker is not installed or is not available in PATH." >&2
    echo "Install Docker from https://docs.docker.com/engine/install/" >&2
    exit 1
fi

if ! docker info >/dev/null 2>&1; then
    echo "Error: the Docker daemon is not running or your user cannot access it." >&2
    echo "Start Docker and try again." >&2
    exit 1
fi

if docker compose version >/dev/null 2>&1; then
    COMPOSE_COMMAND=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
    COMPOSE_COMMAND=(docker-compose)
else
    echo "Error: Docker Compose is not installed." >&2
    exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
    echo "Error: backend/.env does not exist." >&2
    echo "Create it with: cp backend/.env.example backend/.env" >&2
    echo "Then replace the placeholder TMDB token and JWT secret." >&2
    exit 1
fi

required_variables=(
    SECRET_KEY
    ALGORITHM
    ACCESS_TOKEN_EXPIRE_MINUTES
    TMDB_ACCESS_TOKEN
)

for variable in "${required_variables[@]}"; do
    if ! grep -Eq "^[[:space:]]*${variable}=.+" "$ENV_FILE"; then
        echo "Error: $variable is missing or empty in backend/.env." >&2
        exit 1
    fi
done

echo "Starting Movie Match..."
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:8000"
echo "API docs: http://localhost:8000/docs"
echo

cd "$PROJECT_DIR"
exec "${COMPOSE_COMMAND[@]}" up --build
