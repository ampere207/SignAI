from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from routers import users, videoChat
from database import create_tables

create_tables()

# Update OAuth2 configuration for Swagger UI
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

app = FastAPI(
    title="SignAI API",
    description="API for SignAI application",
    version="1.0.0",
    # Configure OAuth2 for Swagger UI
    swagger_ui_oauth2_redirect_url="/docs/oauth2-redirect",
    swagger_ui_init_oauth={
        "usePkceWithAuthorizationCodeGrant": True,
        "clientId": "swagger-ui",
    }
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods including OPTIONS
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(videoChat.router)


@app.get("/")
def read_root():
    return {"message": "Welcome to SignAI API"}