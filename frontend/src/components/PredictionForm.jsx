import React, { useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./PredictionForm.css";

function PredictionForm() {
  const [ticker, setTicker] = useState("AAPL");
  const [days, setDays] = useState(5);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const response = await axios.post("http://localhost:8000/api/predict", {
        ticker,
        days,
      });
      setResult(response.data);
    } catch (err) {
      setError("Prediction failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>📈 Stock Price Prediction</h2>
        <form onSubmit={handleSubmit}>
          <label>Ticker Symbol:</label>
          <select
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            required
          >
            <option value="">-- Select Company --</option>
            <option value="AAPL">Apple (AAPL)</option>
            <option value="MSFT">Microsoft (MSFT)</option>
            <option value="GOOGL">Google (GOOGL)</option>
            <option value="AMZN">Amazon (AMZN)</option>
            <option value="TSLA">Tesla (TSLA)</option>
            <option value="META">Meta (META)</option>
            <option value="NFLX">Netflix (NFLX)</option>
            <option value="NVDA">NVIDIA (NVDA)</option>
            <option value="TCS.NS">TCS (TCS.NS)</option>
            <option value="RELIANCE.NS">Reliance (RELIANCE.NS)</option>
          </select>

          <label>Number of Days:</label>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            min="1"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Predicting..." : "Predict"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {result && (
          <div className="result">
            <h3>Predictions for {result.ticker}</h3>
            <ul>
              {result.predictions.map((entry, index) => (
                <li key={index}>
                  {new Date(entry.ds).toLocaleDateString()}:{" "}
                  <strong>{entry.yhat.toFixed(2)}</strong>
                </li>
              ))}
            </ul>

            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={result.predictions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ds" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="yhat"
                    stroke="#4a90e2"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PredictionForm;
