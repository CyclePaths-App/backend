import express = require("express");
import cors = require("cors");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});