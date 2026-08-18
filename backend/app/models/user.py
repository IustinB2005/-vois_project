
from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    username = Column(
        String,
        unique=True,
        index=True
    )

    email = Column(
        String,
        unique=True,
        index=True
    )

    password = Column(String)
   # Cele 2  intrebari stricte
    preferred_decade = Column(JSON)
    preferred_genre = Column(JSON)
    
    # Legatura cu camera (Lobby)
    lobby_id = Column(Integer, ForeignKey("lobbies.id"), nullable=True)
    lobby = relationship("Lobby", back_populates="users", foreign_keys=[lobby_id])