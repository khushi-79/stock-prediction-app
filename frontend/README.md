### 📁 `frontend/README.md`

````markdown
# 📊 Stock Prediction App - Frontend

This is the **React-based frontend** for the Stock Price Prediction App.  
It allows users to select a stock (ticker symbol), enter the number of days to forecast, and view the results as a chart and list.

---

## 🚀 Features

- Dropdown for popular stock ticker symbols (e.g., AAPL, MSFT, TSLA, etc.)
- Input for number of days to predict (default: 5)
- Beautiful prediction chart using **Recharts**
- Displays prediction dates and prices

---

## 📦 Setup & Run

1. Make sure you are in the `frontend/` folder:

   ```bash
   cd frontend
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:

   ```bash
   npm start
   ```

   This will run the app at `http://localhost:3000`

> ⚠️ Make sure your backend FastAPI server is running at `http://localhost:8000`

---

## 🔗 API Used

This app calls the backend API endpoint:

```http
POST http://localhost:8000/api/predict
```

Payload:

```json
{
  "ticker": "AAPL",
  "days": 5
}
```

Response:

```json
{
  "ticker": "AAPL",
  "predicted_days": 5,
  "predictions": [
    {
      "ds": "2025-06-26T00:00:00",
      "yhat": 199.27
    },
    ...
  ]
}
```

---

## 🎨 Stack Used

* React
* Axios
* Recharts
* CSS

---

## 📁 Folder Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   └── PredictionForm.jsx
│   ├── App.js
│   ├── index.js
│   └── ...
└── package.json
