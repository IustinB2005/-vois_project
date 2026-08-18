from sqlalchemy import Column, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    lobby_id = Column(Integer, ForeignKey("lobbies.id"))
    movie_id = Column(Integer, index=True) # ID-ul filmului de la TMDB
    is_like = Column(Boolean) # True = Like (Swipe Right), False = Pass (Swipe Left)

    user = relationship("User")
    lobby = relationship("Lobby")