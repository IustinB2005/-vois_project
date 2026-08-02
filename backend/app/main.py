from fastapi import FastAPI

from app.core.database import Base, engine
from app.models import user
from app.api.routes import router


Base.metadata.create_all(bind=engine)


app = FastAPI()


app.include_router(router)


@app.get("/")
def root():
    return {
        "message": "API running"
    }