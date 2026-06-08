from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import uuid

# Association table for users in rooms
user_room_association = Table(
    'user_room_association',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('room_id', Integer, ForeignKey('rooms.id'))
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    
    # Relationship to rooms (many-to-many)
    rooms = relationship("Room", secondary=user_room_association, back_populates="users")

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    room_code = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=func.now())
    
    # Relationship to users (many-to-many)
    users = relationship("User", secondary=user_room_association, back_populates="rooms")
    
    @staticmethod
    def generate_room_code():
        """Generate a unique room code"""
        return str(uuid.uuid4())[:6].upper()