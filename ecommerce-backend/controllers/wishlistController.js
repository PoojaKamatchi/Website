import Wishlist from "../models/wishlistModel.js";

// GET Wishlist
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");
    res.json({
      products: wishlist?.products || [],
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching wishlist" });
  }
};

// ADD to Wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "ProductId required" });

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
    }

    await wishlist.save();

    const populatedWishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");

    res.json({ products: populatedWishlist.products.reverse() }); // latest first
  } catch (err) {
    res.status(500).json({ message: "Error adding wishlist item" });
  }
};

// REMOVE from Wishlist – FIXED
export const removeFromWishlist = async (req, res) => {
  try {
    const productId = req.params.id; // <- fix: use req.params.id
    if (!productId) return res.status(400).json({ message: "ProductId required" });

    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) return res.json({ products: [] });

    wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);

    await wishlist.save();

    const updatedWishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");

    res.json({ products: updatedWishlist.products.reverse() }); // latest first
  } catch (err) {
    res.status(500).json({ message: "Error removing wishlist item" });
  }
};
