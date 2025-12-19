import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { sendOrderNotification } from "../utils/orderMail.js";


/* ================= CREATE ORDER ================= */
export const createOrder = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Payment screenshot required" });
    }

    let items;
    try {
      items = JSON.parse(req.body.orderItems);
      if (!Array.isArray(items) || items.length === 0) throw new Error();
    } catch {
      return res.status(400).json({ message: "Invalid order items" });
    }

    const orderItems = [];

    // ✅ BUILD ORDER ITEMS + REDUCE STOCK
    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `${product.name.en} out of stock`,
        });
      }

      product.stock -= item.quantity;
      await product.save();

      orderItems.push({
        name: product.name.en,
        quantity: item.quantity,
        price: product.price,
        productId: product._id,
      });
    }

    const order = await Order.create({
      user: req.user._id,
      name: req.body.name,
      mobile: req.body.mobile,
      shippingAddress: req.body.shippingAddress,
      orderItems,
      totalAmount: req.body.totalAmount,
      paymentMethod: "UPI",
      paymentScreenshot: `/uploads/${req.file.filename}`,
    });

    // 📩 Send admin notification mail
    await sendOrderNotification(order);

    res.status(201).json(order);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= USER ORDERS ================= */
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET ORDER BY ID ================= */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= CANCEL ORDER BY USER ================= */
export const cancelOrderByUser = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.orderStatus !== "Processing") {
      return res.status(400).json({ message: "Cannot cancel at this stage" });
    }

    order.orderStatus = "Cancelled";
    order.cancelledBy = "USER";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= ADMIN ORDERS ================= */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= ADMIN ORDER STATUS ================= */
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = req.body.status;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= PAYMENT STATUS ================= */
export const updatePaymentStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = req.body.paymentStatus;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
