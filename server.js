require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Url = require('./models/Url');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public')); // เรียกใช้หน้าเว็บ

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ เชื่อมต่อ MongoDB สำเร็จ'))
  .catch((err) => console.error('❌ MongoDB Error:', err));

app.post('/api/shorten', async (req, res) => {
  const { longUrl, customCode, expiresInDays } = req.body;
  if (!longUrl) return res.status(400).json({ error: 'กรุณาระบุ URL ต้นทาง' });

  try {
    let urlCode = customCode;
    if (customCode) {
      const existing = await Url.findOne({ urlCode: customCode });
      if (existing) return res.status(400).json({ error: 'ชื่อนี้ถูกใช้ไปแล้ว' });
    }
    let expiresAt = null;
    if (expiresInDays) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresInDays));
    }
    const newUrl = await Url.create({ longUrl, urlCode: urlCode || undefined, expiresAt });
    res.json({ shortUrl: `${process.env.BASE_URL}/${newUrl.urlCode}`, expiresAt: newUrl.expiresAt });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });
    if (url) {
      if (url.expiresAt && url.expiresAt < new Date()) {
         return res.status(410).send('<h1>🚫 ลิงก์นี้หมดอายุการใช้งานแล้ว</h1>');
      }
      url.clicks++;
      await url.save();
      return res.redirect(url.longUrl);
    } else { return res.status(404).send('<h1>❌ ไม่พบลิงก์ในระบบ</h1>'); }
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));