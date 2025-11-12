const express = require('express');
const path = require('path');
const crypto = require('crypto');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// 🔌 Koneksi ke database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'kikaho86', // ganti sesuai password MySQL kamu
  database: 'apikeyc',
  port: 3309
});

db.connect((err) => {
  if (err) {
    console.error('❌ Gagal konek DB:', err);
  } else {
    console.log('✅ Koneksi DB sukses');
  }
});

app.use(express.json());
app.use(express.static('public'));



// 🧩 Validasi API key
app.post('/checkapi', (req, res) => {
  const { apikey } = req.body;
  if (!apikey) {
    return res.status(400).json({ valid: false, message: 'API key tidak boleh kosong' });
  }

  const sql = 'SELECT * FROM token WHERE token = ?';
  db.query(sql, [apikey], (err, results) => {
    if (err) {
      console.error('❌ Error check API key:', err);
      return res.status(500).json({ valid: false, message: 'Kesalahan server' });
    }

    if (results.length > 0) {
      console.log(`✅ Valid API key: ${apikey}`);
      return res.json({ valid: true, message: 'API key valid', data: results[0] });
    } else {
      console.log(`❌ Tidak ditemukan: ${apikey}`);
      return res.status(401).json({ valid: false, message: 'API key tidak ditemukan' });
    }
  });
});

// 🧩 Tampilkan semua API keyy
app.get('/allkeys', (req, res) => {
  const sql = 'SELECT * FROM token ORDER BY id DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error ambil data:', err);
      return res.status(500).json({ message: 'Gagal ambil data' });
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`🚀 Server jalan di http://localhost:${port}`);
});
