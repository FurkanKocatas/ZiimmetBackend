const express = require("express");
const Assignment = require("../models/Assignment");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Zimmet ekleme
router.post("/", async (req, res) => {
  try {
    const { itemName, assignedTo, returnDate } = req.body;
    const newAssignment = new Assignment({ itemName, assignedTo, returnDate });
    await newAssignment.save();
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Tüm zimmetleri listeleme
router.get("/", async (req, res) => {
  try {
    const assignments = await Assignment.find().populate("assignedTo", "name email");
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Tek bir zimmeti getirme
router.get("/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate("assignedTo", "name email");
    if (!assignment) return res.status(404).json({ message: "Zimmet bulunamadı" });
    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ✅ Belirli bir kullanıcının zimmetlerini getirme
router.get("/user/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const assignments = await Assignment.find({ assignedTo: userId }).populate("assignedTo", "name email");
      res.status(200).json(assignments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// ✅ Zimmeti güncelleme
router.put("/:id", async (req, res) => {
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAssignment) return res.status(404).json({ message: "Zimmet bulunamadı" });
    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Zimmeti silme
router.delete("/:id", async (req, res) => {
  try {
    const deletedAssignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!deletedAssignment) return res.status(404).json({ message: "Zimmet bulunamadı" });
    res.status(200).json({ message: "Zimmet başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ✅ Belirli bir kullanıcının zimmetlerini getirme
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const assignments = await Assignment.find({ assignedTo: userId }).populate("assignedTo", "name email");
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ✅ Zimmet ekleme (Sadece giriş yapmış kullanıcılar)
router.post("/", authMiddleware, async (req, res) => {
    try {
      console.log("✅ Kullanıcı:", req.user); // Debug log
  
      const { itemName, returnDate } = req.body;
      const newAssignment = new Assignment({ itemName, assignedTo: req.user.id, returnDate });
  
      await newAssignment.save();
      res.status(201).json(newAssignment);
    } catch (error) {
      console.error("❌ Hata:", error); // Hata logu ekle
      res.status(500).json({ message: error.message });
    }
  });
  
  
  
  
  // ✅ Zimmeti güncelleme (Sadece yetkili kişiler)
  router.put("/:id", authMiddleware, async (req, res) => {
    try {
      const updatedAssignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedAssignment) return res.status(404).json({ message: "Zimmet bulunamadı" });
      res.status(200).json(updatedAssignment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // ✅ Zimmeti silme (Sadece yetkili kişiler)
  router.delete("/:id", authMiddleware, async (req, res) => {
    try {
      const deletedAssignment = await Assignment.findByIdAndDelete(req.params.id);
      if (!deletedAssignment) return res.status(404).json({ message: "Zimmet bulunamadı" });
      res.status(200).json({ message: "Zimmet başarıyla silindi" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YTdkMDk2ZTM1ZGYxN2U0ODJkMjBkYiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzM5MDU0MjQ1LCJleHAiOjE3Mzk2NTkwNDV9.k_3wa9xMgRj8lj70uzoPP5bjwf-ftn-56oPNsk6nI58
module.exports = router;
