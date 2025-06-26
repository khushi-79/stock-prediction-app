from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import prediction

app = FastAPI(title="Stock Price Prediction API")

# Register prediction routes
app.include_router(prediction.router, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Stock Prediction API!"}
