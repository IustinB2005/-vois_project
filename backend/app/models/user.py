from sqlalchemy import Column, Integer, String,ForeignKey
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
   # Cele 2 noi intrebari stricte
    preferred_decade = Column(String)
    preferred_genre = Column(String)
    
    # Legatura cu camera (Lobby)
    lobby_id = Column(Integer, ForeignKey("lobbies.id"), nullable=True)
    lobby = relationship("Lobby", back_populates="users", foreign_keys=[lobby_id])