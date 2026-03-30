const express = require("express");
const app = express();

app.get("/products", (req, res) => {
  res.json([{ id: 1, product: "Laptop" }]);
});

app.get("/health", (req, res) => res.send("OK"));

app.listen(3002, () => console.log("Product service running"));
