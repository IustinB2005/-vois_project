from pydantic import BaseModel
from typing import List, Optional


class MemberOut(BaseModel):
    id: int
    username: str

    model_config = {"from_attributes": True}


class LobbyJoin(BaseModel):
    code: str


class LobbyOut(BaseModel):
    id: int
    code: str
    status: str
    host_id: Optional[int] = None
    users: List[MemberOut] = []

    model_config = {"from_attributes": True}