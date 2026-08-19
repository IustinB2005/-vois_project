from sqlalchemy import Column, Integer, String, ForeignKey,Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base


class Lobby(Base):
    __tablename__ = "lobbies"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    status = Column(String, default="waiting")  # waiting -> matching -> voting -> done
    host_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    users = relationship("User", back_populates="lobby", foreign_keys="User.lobby_id")
    host = relationship("User", foreign_keys=[host_id])


 

class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True, index=True)
    lobby_id = Column(Integer, ForeignKey("lobbies.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    movie_id = Column(Integer, index=True) # ID-ul filmului de la TMDB
    is_like = Column(Boolean) # True pt Swipe Right, False pt Swipe Left