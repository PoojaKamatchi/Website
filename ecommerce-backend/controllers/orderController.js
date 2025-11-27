import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js"; // ✅ import Cart to clear it

// Create order
export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, mobile, address, cartItems, totalAmount, shippingCharge, paymentMethod } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Ensure product names are strings
    const orderItems = cartItems.map(item => ({
      productId: item.product?._id || item.productId,
      name: typeof item.name === "string" ? item.name : item.product?.name || "Unnamed Product",
      price: item.price || item.product?.price || 0,
      quantity: item.quantity || 1,
    }));

    const newOrder = new Order({
      user: userId,
      name,
      mobile,
      orderItems,
      shippingAddress: address,
      totalAmount,
      shippingCharge,
      paymentMethod: paymentMethod || "COD",
      status: "Processing",
      createdAt: new Date(), // ✅ timestamp
    });

    await newOrder.save();

    // ✅ Clear user's cart in backend
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ message: "Failed to create order", error: err.message });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("orderItems.productId", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized to cancel this order" });
    if (order.status === "Delivered")
      return res.status(400).json({ message: "Delivered orders cannot be cancelled" });

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    res.status(500).json({ message: "Cannot cancel order", error: err.message });
  }
};

// Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.productId", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};

// Update order status (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status", error: err.message });
  }
};
