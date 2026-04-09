const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const SECRET = process.env.TEBEX_SECRET;
const PACKAGE_ID = 7380254;

app.post("/create-checkout", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "No username" });
    }

    // create basket
    const basketRes = await fetch("https://headless.tebex.io/api/baskets", {
      method: "POST",
      headers: {
        "X-Tebex-Secret": SECRET,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username })
    });

    const basket = await basketRes.json();
    const basketId = basket.data.ident;

    // add package
    await fetch(`https://headless.tebex.io/api/baskets/${basketId}/packages`, {
      method: "POST",
      headers: {
        "X-Tebex-Secret": SECRET,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        package_id: PACKAGE_ID
      })
    });

    // get checkout
    const checkoutRes = await fetch(
      `https://headless.tebex.io/api/baskets/${basketId}`,
      {
        headers: { "X-Tebex-Secret": SECRET }
      }
    );

    const checkout = await checkoutRes.json();

    res.json({ url: checkout.data.links.checkout });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, () => console.log("Server running"));
