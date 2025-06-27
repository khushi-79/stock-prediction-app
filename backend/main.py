from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import prediction
from app.routes import get_price as price_router
from app.routes import symbols  # Import your new route module

app = FastAPI(title="Stock Price Prediction API")

# Register prediction routes
app.include_router(prediction.router, prefix="/api")
app.include_router(symbols.router, prefix="/api")
app.include_router(price_router.router, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Stock Prediction API!"}
