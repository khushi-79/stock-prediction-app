from fastapi import FastAPI
from app.routes import prediction

app = FastAPI(title="Stock Price Prediction API")

# Register prediction routes
app.include_router(prediction.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to Stock Prediction API!"}
