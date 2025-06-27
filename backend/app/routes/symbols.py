from fastapi import APIRouter
import requests
import pandas as pd
from io import StringIO
from fastapi.responses import JSONResponse

router = APIRouter()

API_KEY = "8LYVXY9ONGITUCL4"

@router.get("/symbols")
def get_symbols():
    url = f"https://www.alphavantage.co/query?function=LISTING_STATUS&apikey={API_KEY}&datatype=csv"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        df = pd.read_csv(StringIO(response.text))

        # ✅ Check if 'status' column exists
        if 'status' in df.columns:
            df = df[df['status'] == 'Active']
        else:
            # fallback: just take first 1000 rows
            df = df.head(1000)

        # ✅ Select columns if they exist
        required_cols = ['symbol', 'name', 'exchange']
        existing_cols = [col for col in required_cols if col in df.columns]
        data = df[existing_cols].fillna("").head(1000)

        return JSONResponse(content=data.to_dict(orient="records"))

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)