const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Veritabanına bağlan ve sunucuyu başlat
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Sunucu ${PORT} portunda çalışıyor...`);
  });
});
