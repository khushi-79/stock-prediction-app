import React, { useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function PredictionForm() {
  const [ticker, setTicker] = useState("");
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
      setLoading(false);
    } catch (err) {
      setError("Prediction failed. Try again.");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h2>📈 Stock Price Prediction</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Ticker Symbol:
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            required
            placeholder="e.g., AAPL"
          />
        </label>
        <br /><br />
<label>
  Select Company:
  <select value={ticker} onChange={(e) => setTicker(e.target.value)} required>
    <option value="">-- Select Ticker --</option>
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
</label>

        {loading && <p>Loading prediction... ⏳</p>}
        <br /><br />
        <button type="submit">Predict</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
  <div style={{ marginTop: "2rem" }}>
    <h3>Predictions for {result.ticker}:</h3>

    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={result.predictions}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="ds" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="yhat" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>

    <ul>
      {result.predictions.map((entry, index) => (
        <li key={index}>
          {new Date(entry.ds).toLocaleDateString()}:{" "}
          <strong>{entry.yhat.toFixed(2)}</strong>
        </li>
      ))}
    </ul>
  </div>
)}
    </div>
  );
}

export default PredictionForm;
