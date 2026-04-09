const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ===== MIDDLEWARE =====
app.use(cors({
  origin: "*", // можно потом заменить на твой домен
  methods: ["GET", "POST"],
}));

app.use(express.json());

// ===== TEST ROUTE (Render check) =====
app.get("/", (req, res) => {
  res.send("Tebex backend is running");
});

// ===== CREATE CHECKOUT LINK =====
// сюда фронт будет отправлять ник игрока + товар
app.post("/create-checkout", (req, res) => {
  const { username, packageId } = req.body;

  if (!username || !packageId) {
    return res.status(400).json({ error: "Missing username or packageId" });
  }

  // Tebex checkout URL
  const tebexUrl = `https://checkout.tebex.io/${process.env.TEBEX_STORE_ID}/package/${packageId}?username=${encodeURIComponent(username)}`;

  return res.json({
    url: tebexUrl
  });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
