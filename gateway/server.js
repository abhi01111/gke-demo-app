const express = require("express");
const axios = require("axios");

const app = express();

app.get("/", (req, res) => {
  res.send("🚀 Microservices Gateway Running");
});

app.get("/users", async (req, res) => {
  const response = await axios.get("http://user-service:3001/users");
  res.json(response.data);
});

app.get("/products", async (req, res) => {
  const response = await axios.get("http://product-service:3002/products");
  res.json(response.data);
});

app.listen(3000, () => console.log("Gateway running"));
