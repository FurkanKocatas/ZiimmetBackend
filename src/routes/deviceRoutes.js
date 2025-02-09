const express = require("express");
const router = express.Router();

const devices = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "Mouse" },
  { id: 3, name: "Keyboard" }
];

// ✅ Tüm cihazları getir
router.get("/", (req, res) => {
  res.json(devices);
});

module.exports = router;
