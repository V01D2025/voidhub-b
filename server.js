const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 🔐 Middleware
app.use(cors());
app.use(express.json());

// ⚠️ Берём ключ из .env
const TEBEX_SECRET = process.env.TEBEX_SECRET;

if (!TEBEX_SECRET) {
  console.error("❌ Нет TEBEX_SECRET в .env");
  process.exit(1);
}

// 🧠 ROUTE
app.post('/create-checkout', async (req, res) => {
  try {
    const { username, packageId } = req.body;

    if (!username || !packageId) {
      return res.status(400).json({ error: 'Нет username или packageId' });
    }

    // 📡 Запрос к Tebex
    const tebexRes = await fetch('https://plugin.tebex.io/checkout', {
      method: 'POST',
      headers: {
        'X-Tebex-Secret': TEBEX_SECRET,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        basket: {
          username: username,
          complete_url: 'hhttps://v01d2025.github.io/voidhub/',
          cancel_url: 'https://v01d2025.github.io/voidhub/'
        },
        packages: [
          { id: packageId }
        ]
      })
    });

    const data = await tebexRes.json();

    // 🔴 Если Tebex не вернул ссылку
    if (!data.data || !data.data.url) {
      console.error("❌ Tebex error:", data);
      return res.status(500).json({ error: 'Tebex не дал ссылку', details: data });
    }

    // ✅ Всё ок
    res.json({ url: data.data.url });

  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🌍 Проверка (чтобы не было "Cannot GET")
app.get('/', (req, res) => {
  res.send('VoidHub Backend работает 🚀');
});

// 🚀 PORT (ВАЖНО для Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server запущен на порту ${PORT}`);
});
