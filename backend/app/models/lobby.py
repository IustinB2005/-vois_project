from sqlalchemy import Column, Integer, String, ForeignKey
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