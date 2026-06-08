import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.sql import func

# Create database directory if it doesn't exist
os.makedirs(os.path.dirname(os.path.abspath(__file__)), exist_ok=True)

# Database URL
DATABASE_URL = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'gestureX.db')}"

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Create tables
def create_tables():
    Base.metadata.create_all(bind=engine)


# Database session dependency
def get_db():
    """
    Dependency to get a database session.
    Usage in FastAPI:
    @app.get("/users/")
    def read_users(db: Session = Depends(get_db)):
        ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Initialize database tables
create_tables()