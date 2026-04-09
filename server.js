const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Проверка сервера
app.get("/", (req, res) => {
  res.send("OK");
});

// Создание checkout (ПОКА ТЕСТ)
app.post("/create-checkout", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "No username" });
    }

    // Пока просто редирект на Tebex (тест)
    return res.json({
      url: "https://checkout.tebex.io/"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
