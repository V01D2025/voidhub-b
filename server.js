const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Tebex backend is running");
});

app.post("/create-checkout", (req, res) => {
  const { username, packageId } = req.body;

  if (!username || !packageId) {
    return res.status(400).json({ error: "Missing username or packageId" });
  }

  const tebexUrl = `https://checkout.tebex.io/${process.env.TEBEX_STORE_ID}/package/${packageId}?username=${encodeURIComponent(username)}`;

  res.json({ url: tebexUrl });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server started");
});
