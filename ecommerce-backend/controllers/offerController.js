import Offer from "../models/offerModel.js";

// Create new offer (with imageFile or image URL)
export const createOffer = async (req, res) => {
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
  } catch (error) {
    console.error("Create Offer Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all offers (admin)
export const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get active offers (customer)
export const getActiveOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update offer
export const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete offer
export const deleteOffer = async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ message: "Offer removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
