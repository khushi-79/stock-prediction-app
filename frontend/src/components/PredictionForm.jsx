import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const Container = styled.div`
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  background-color: #f4f4f8;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
`;

const Heading = styled.h2`
  text-align: center;
  color: #333;
`;

const Label = styled.label`
  display: block;
  margin-top: 1rem;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;
const SearchInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  margin-top: 2rem;
  background-color: #0066ff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;

  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  color: red;
`;

const PriceCard = styled.div`
  background: #fff;
  padding: 1rem;
  margin-top: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
`;

const PredictionList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin-top: 1rem;
`;

const PredictionItem = styled.li`
  margin-bottom: 5px;
`;

function PredictionForm() {
  const [ticker, setTicker] = useState("");
  const [symbols, setSymbols] = useState([]);
  const [days, setDays] = useState(5);
  const [result, setResult] = useState(null);
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch ticker list on mount
  useEffect(() => {
    axios.get("stock-prediction-app-production.up.railway.app/api/symbols")
      .then((res) => {
        setSymbols(res.data.slice(0, 15000)); // limit to first 20 for dropdown
      })
      .catch((err) => {
        console.error("Error fetching symbols:", err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResult(null);
    setPrice(null);

    try {
      const prediction = await axios.post("stock-prediction-app-production.up.railway.app/api/predict", {
        ticker,
        days,
      });

      if (prediction.data?.predictions) {
        setResult(prediction.data);
      } else {
        setError("No prediction data returned.");
      }

      const priceRes = await axios.get(`stock-prediction-app-production.up.railway.app/api/price/${ticker}`);
      setPrice(priceRes.data);
    } catch (err) {
      console.error(err);
      setError("Prediction failed. Try again.");
    }

    setLoading(false);
  };

  return (
    <Container>
      <Heading>📈 Stock Price Prediction</Heading>
      <form onSubmit={handleSubmit}>
        <Label>Choose Company:</Label>
       <SearchInput
  type="text"
  placeholder="Search Ticker or Company Name..."
  value={ticker}
  onChange={(e) => setTicker(e.target.value)}
  list="ticker-options"
  required
/>

<datalist id="ticker-options">
  {symbols
    .filter(item =>
      `${item.name} ${item.symbol}`.toLowerCase().includes(ticker.toLowerCase())
    )
    .slice(0, 15)
    .map((item, index) => (
      <option key={index} value={item.symbol}>
        {item.name} ({item.symbol})
      </option>
  ))}
</datalist>

        <Label>Days of Prediction:</Label>
        <Input
          type="number"
          min="1"
          max="30"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Predict"}
        </Button>
      </form>

      {error && <ErrorText>{error}</ErrorText>}

      {price && price["Global Quote"] && (
        <PriceCard>
          <h3>💹 {price["Global Quote"]["01. symbol"]}</h3>
          <p>Open: {price["Global Quote"]["02. open"]}</p>
          <p>High: {price["Global Quote"]["03. high"]}</p>
          <p>Low: {price["Global Quote"]["04. low"]}</p>
          <p>Price: <strong>{price["Global Quote"]["05. price"]}</strong></p>
          <p>Change: {price["Global Quote"]["09. change"]} ({price["Global Quote"]["10. change percent"]})</p>
          <p>Latest Day: {price["Global Quote"]["07. latest trading day"]}</p>
        </PriceCard>
      )}

      {result?.predictions && (
        <>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={result.predictions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ds" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="yhat" stroke="#007bff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>

        <PriceCard>
            <h4>📝 Summary:</h4>
            <p>
              <strong>{ticker}</strong> is predicted to reach approximately <strong>₹
              {Number(result.predictions[result.predictions.length - 1].yhat).toFixed(2)}</strong> in{" "}
              <strong>{days}</strong> days.
            </p>
          </PriceCard>

          <PriceCard>
            <h4>🔢 Prediction Details:</h4>
            <PredictionList>
              {result.predictions.map((item, index) => (
                <PredictionItem key={index}>
                  <strong>{item.ds}:</strong> ₹{Number(item.yhat).toFixed(2)}
                </PredictionItem>
              ))}
            </PredictionList>
          </PriceCard>

          <iframe
            src={`https://s.tradingview.com/embed-widget/mini-symbol-overview/?symbol=${ticker}&locale=en`}
            style={{ width: "100%", height: "300px", border: "none", marginTop: "60px" }}
            allowTransparency
            scrolling="no"
          ></iframe>
          </>
      )}
    </Container>
  );
}

export default PredictionForm;
