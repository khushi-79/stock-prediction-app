from fastapi import APIRouter
import requests

router = APIRouter()

API_KEY = "8LYVXY9ONGITUCL4"  # Replace with your actual API key

@router.get("/price/{symbol}")
def get_stock_price(symbol: str):
    url = f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={API_KEY}"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        quote = data.get("Global Quote", {})
        if not quote or "01. symbol" not in quote:
            return {"error": "Invalid symbol or data not found"}

        # Cleaned and renamed output
        return {
            "symbol": quote.get("01. symbol"),
            "open": quote.get("02. open"),
            "high": quote.get("03. high"),
            "low": quote.get("04. low"),
            "price": quote.get("05. price"),
            "volume": quote.get("06. volume"),
            "latest_trading_day": quote.get("07. latest trading day"),
            "previous_close": quote.get("08. previous close"),
            "change": quote.get("09. change"),
            "change_percent": quote.get("10. change percent")
        }

    except Exception as e:
        return {"error": str(e)}
