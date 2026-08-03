from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app.models import user
from app.api.routes import router


Base.metadata.create_all(bind=engine)


app = FastAPI()

# Configurare CORS adaugata
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permite cereri de la orice sursa (necesar pt dezvoltare locala)
    allow_credentials=True,
    allow_methods=["*"], # Permite toate metodele HTTP (GET, POST, etc.)
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def root():
    return {
        "message": "API running"
    }