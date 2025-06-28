from fastapi import APIRouter
import requests
from fastapi.responses import JSONResponse
import os

router = APIRouter()

API_KEY = os.getenv("FINNHUB_API_KEY", "d1fr5uhr01qig3h3nbbgd1fr5uhr01qig3h3nbc0")  # or use .env

@router.get("/symbols")
def get_symbols():
    url = f"https://finnhub.io/api/v1/stock/symbol?exchange=US&token={API_KEY}"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()

        # Return top 300 most popular (just sample filtering)
        data = sorted(data, key=lambda x: x.get("symbol", ""))[:300]

        # You can further filter by type or active status
        formatted = [{"symbol": s["symbol"], "name": s.get("description", ""), "exchange": s.get("exchange", "")} for s in data]
        return JSONResponse(content=formatted)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
