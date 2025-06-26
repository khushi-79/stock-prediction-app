# from fastapi import APIRouter
# from pydantic import BaseModel

# router = APIRouter()

# # Input model for prediction request
# class StockRequest(BaseModel):
#     ticker: str
#     days: int

# @router.post("/predict")
# def predict_stock(req: StockRequest):
#     # Dummy logic – replace with ML prediction later
#     prediction = [100 + i * 2 for i in range(req.days)]
#     return {
#         "ticker": req.ticker.upper(),
#         "predicted_days": req.days,
#         "predicted_prices": prediction
#     }

from fastapi import APIRouter
from pydantic import BaseModel
import yfinance as yf
import pandas as pd
from prophet import Prophet

router = APIRouter()

class StockRequest(BaseModel):
    ticker: str
    days: int

@router.post("/predict")
def predict_stock(req: StockRequest):
    # Step 1: Download stock data
    data = yf.download(req.ticker, period="6mo", interval="1d", auto_adjust=False)

    if data.empty or "Close" not in data.columns:
        return {"error": "No data available for this ticker."}

    # Step 2: Build DataFrame safely
    try:
        df = pd.DataFrame({
    "ds": data.index,
    "y": data["Close"].values.flatten()
})
    except Exception as e:
        return {"error": f"Error creating DataFrame: {str(e)}"}

    # Step 3: Clean data
    df["y"] = pd.to_numeric(df["y"], errors="coerce")
    df.dropna(inplace=True)

    if df.empty:
        return {"error": "No valid data after cleaning."}

    # Step 4: Train Prophet
    model = Prophet(daily_seasonality=True)
    model.fit(df)

    # Step 5: Forecast
    future = model.make_future_dataframe(periods=req.days)
    forecast = model.predict(future)

    result = forecast[["ds", "yhat"]].tail(req.days)

    return {
        "ticker": req.ticker.upper(),
        "predicted_days": req.days,
        "predictions": result.to_dict(orient="records")
    }
