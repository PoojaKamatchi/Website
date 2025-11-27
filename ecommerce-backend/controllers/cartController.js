import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.stock < quantity) return res.status(400).json({ message: "Not enough stock" });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });

    const existingItem = cart.items.find(i => i.product.toString() === productId);

    if (existingItem) {
      if (product.stock < existingItem.quantity + quantity)
        return res.status(400).json({ message: "Insufficient stock" });
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    product.stock -= quantity;
    await product.save();
    await cart.save();

    const populated = await cart.populate("items.product");
    res.status(200).json(populated);
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Failed to add to cart", error: err.message });
  }
};

// Get user cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart", error: err.message });
  }
};

// Update quantity
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(i => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const diff = quantity - item.quantity;
    if (diff > 0 && product.stock < diff)
      return res.status(400).json({ message: "Insufficient stock" });

    product.stock -= diff;
    item.quantity = quantity;

    await product.save();
    await cart.save();

    const populated = await cart.populate("items.product");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update cart", error: err.message });
  }
};

// Remove item
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(i => i.product.toString() === productId);
    if (item) {
      const product = await Product.findById(productId);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    cart.items = cart.items.filter(i => i.product.toString() !== productId);
    await cart.save();

    const populated = await cart.populate("items.product");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: "Failed to remove item", error: err.message });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    cart.items = [];
    await cart.save();
    res.json({ message: "Cart cleared successfully", items: [] });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear cart", error: err.message });
  }
};
