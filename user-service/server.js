const express = require("express");
const app = express();

app.get("/users", (req, res) => {
  res.json([{ id: 1, name: "Abhishek" }]);
});

app.get("/health", (req, res) => res.send("OK"));

app.listen(3001, () => console.log("User service running"));
