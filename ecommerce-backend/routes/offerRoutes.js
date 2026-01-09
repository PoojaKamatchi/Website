import express from "express";
import multer from "multer";
import path from "path";
import Offer from "../models/offerModel.js";

const router = express.Router();

// ✅ Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});
const upload = multer({ storage });

// 🟢 Create Offer (file or URL)
router.post("/", upload.single("imageFile"), async (req, res) => {
  try {
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image || "";

    const offer = await Offer.create({
      title: req.body.title,
      description: req.body.description,
      discount: Number(req.body.discount),
      image,
      isActive: true,
    });

    res.status(201).json(offer);
  } catch (err) {
    console.error("Create Offer Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// 🟢 Get all offers
router.get("/", async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🟢 Get active offers (for customers)
router.get("/active/list", async (req, res) => {
  try {
    const offers = await Offer.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🟢 Delete offer
router.delete("/:id", async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ message: "Offer removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
