# 📈 Stock Price Prediction App

A full-stack web application that uses machine learning (Prophet model) to forecast stock prices for selected tickers. Built with:

- 🔮 **FastAPI** backend with Prophet model
- 💹 **React** frontend with dynamic graphing via `recharts`
- 📡 Live stock data fetched from Finnhub
- 🚀 Deployed frontend on **Vercel**, backend on **Railway**


## 📦 Features

- 🔍 Live search for stocks 
- 📊 Forecast prices for up to 30 days using time-series modeling
- 💰 Display real-time stock price & summary
- 📈 Interactive charts with prediction points
- 🧠 Uses Facebook Prophet model for accuracy


## 🛠 Tech Stack

| Frontend         | Backend     | ML Model  | Deployment     |
|------------------|-------------|-----------|----------------|
| React, styled-components, Recharts | FastAPI     | Prophet    | Vercel (frontend), Railway (backend) |


## 🧪 Run Locally

### 1. Backend Setup (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
````

### 2. Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

> ⚠️ Ensure `axios` base URLs in frontend point to correct backend (localhost or Railway URL).


## 🌍 Deployed URLs

* **Frontend:** [https://your-vercel-app.vercel.app](https://your-vercel-app.vercel.app)
* **Backend API:** [https://your-railway-backend.up.railway.app](https://your-railway-backend.up.railway.app)


## 🚀 Future Improvements

| Feature                       | Idea                                                                |
| ----------------------------- | ------------------------------------------------------------------- |
| 🧠 Add XGBoost or LSTM        | For comparison with Prophet-based results                           |
| 📈 Add historical trend chart | Show actual vs predicted in same chart                              |
| 🧾 CSV export                 | Export prediction results or price history                          |
| 🔐 Auth system                | Let users save predictions, favorites, or alerts                    |
| 🌐 Multi-currency             | Show predictions for global stocks or currencies                    |
| 📥 Email Alerts               | Notify user of forecast spikes or predictions via email             |
| 🧪 Testing                    | Add PyTest unit/integration tests for backend and React testing lib |

