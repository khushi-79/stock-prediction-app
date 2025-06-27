from fastapi import APIRouter
import requests
import pandas as pd
from io import StringIO
from fastapi.responses import JSONResponse
import os

router = APIRouter()

API_KEY = "8LYVXY9ONGITUCL4"  # Replace with your key

@router.get("/symbols")
def get_symbols():
    url = f"https://www.alphavantage.co/query?function=LISTING_STATUS&apikey={API_KEY}"
    try:
        response = requests.get(url)
        response.raise_for_status()

        df = pd.read_csv(StringIO(response.text))
        df = df[df['status'] == 'Active']

        data = df[['symbol', 'name', 'exchange']].head(1000)

        # ✅ Drop or replace NaNs
        data = data.fillna("")  # Replace NaN with empty string

        return JSONResponse(content=data.to_dict(orient="records"))

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)