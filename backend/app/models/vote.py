from sqlalchemy import Column, Integer, Boolean, ForeignKey
from app.core.database import Base

class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True, index=True)
    lobby_id = Column(Integer, ForeignKey("lobbies.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    movie_id = Column(Integer, index=True) # Salvez direct ID-ul filmului de la TMDB
    is_like = Column(Boolean) # True pentru Like (Swipe Right), False pentru Pass (Swipe Left)