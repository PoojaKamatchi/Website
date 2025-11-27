import Wishlist from "../models/wishlistModel.js";

// Get user wishlist
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.params.userId }).populate("products");
    res.json(wishlist || { products: [] });
  } catch (err) {
    res.status(500).json({ message: "Error fetching wishlist" });
  }
};

// Add to wishlist
export const addToWishlist = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) wishlist = new Wishlist({ userId, products: [] });

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: "Error adding to wishlist" });
  }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
  const { userId } = req.body;
  const { productId } = req.params;
  try {
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
    await wishlist.save();

    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: "Error removing from wishlist" });
  }
};
