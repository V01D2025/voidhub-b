const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("VoidHub backend running");
});

/**
 * CREATE CHECKOUT
 */
app.post("/create-checkout", async (req, res) => {
  try {
    const { username, packageId } = req.body;

    if (!username || !packageId) {
      return res.status(400).json({
        error: "username or packageId missing"
      });
    }

    const tebexResponse = await fetch("https://plugin.tebex.io/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Tebex-Secret": process.env.TEBEX_SECRET
      },
      body: JSON.stringify({
        package_id: packageId,
        username: username,
        complete_url: "https://your-site.com/success",
        cancel_url: "https://your-site.com/cancel"
      })
    });

    const data = await tebexResponse.json();

    if (!data?.links?.checkout) {
      return res.status(500).json({
        error: "Tebex checkout failed",
        debug: data
      });
    }

    res.json({
      url: data.links.checkout
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
