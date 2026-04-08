import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const TEBEX_KEY = process.env.6SOtdoLrwdjjnAwz5DfBhZO3UfwUSGR1;

app.get("/store", async (req, res) => {
  const r = await fetch("https://plugin.tebex.io/categories", {
    headers: { "X-Tebex-Secret": 6SOtdoLrwdjjnAwz5DfBhZO3UfwUSGR1 }
  });
  res.json(await r.json());
});

app.post("/buy", async (req, res) => {
  const { username, packageId } = req.body;

  const basket = await fetch("https://plugin.tebex.io/baskets", {
    method: "POST",
    headers: {
      "X-Tebex-Secret": 6SOtdoLrwdjjnAwz5DfBhZO3UfwUSGR1,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      complete_url: "https://v01d2025.github.io/voidhub/"
    })
  }).then(r => r.json());

  await fetch(`https://plugin.tebex.io/baskets/${basket.ident}/packages`, {
    method: "POST",
    headers: {
      "X-Tebex-Secret": 6SOtdoLrwdjjnAwz5DfBhZO3UfwUSGR1,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      package_id: packageId,
      username: username
    })
  });

  res.json({
    url: `https://checkout.tebex.io/checkout/${basket.ident}`
  });
});

app.listen(10000);
