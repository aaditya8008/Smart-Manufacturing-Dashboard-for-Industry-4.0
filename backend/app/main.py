from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import live, trends, supply
from app.config import BASE_DIR
from app.routers import notifications

app = FastAPI(title="Smart Manufacturing Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(live.router, prefix="/api")
app.include_router(trends.router, prefix="/api")
app.include_router(supply.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")

@app.get("/")
def root():
    return {"status": "ok", "message": "Smart Manufacturing Dashboard API"}
