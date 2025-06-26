from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

# Input model for prediction request
class StockRequest(BaseModel):
    ticker: str
    days: int

@router.post("/predict")
def predict_stock(req: StockRequest):
    # Dummy logic – replace with ML prediction later
    prediction = [100 + i * 2 for i in range(req.days)]
    return {
        "ticker": req.ticker.upper(),
        "predicted_days": req.days,
        "predicted_prices": prediction
    }
