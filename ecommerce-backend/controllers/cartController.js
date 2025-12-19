import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// ================= ADD TO CART =================
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });

    const existingItem = cart.items.find(
      (i) => i.product.toString() === productId
    );

    const totalQty = existingItem
      ? existingItem.quantity + quantity
      : quantity;

    // ✅ ONLY CHECK STOCK
    if (product.stock < totalQty) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    if (existingItem) {
      existingItem.quantity = totalQty;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    const populated = await cart.populate("items.product");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET CART =================
export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );
  res.json(cart || { items: [] });
};

// ================= UPDATE CART =================
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    const item = cart.items.find(
      (i) => i.product.toString() === productId
    );

    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;
    await cart.save();

    const populated = await cart.populate("items.product");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= REMOVE ITEM =================
export const removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  cart.items = cart.items.filter(
    (i) => i.product.toString() !== req.params.productId
  );
  await cart.save();

  const populated = await cart.populate("items.product");
  res.json(populated);
};

// ================= CLEAR CART =================
export const clearCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.json({ items: [] });
};
