// controllers/orderController.js
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import { sendOrderNotification } from "../utils/orderMail.js";

/* ================= CREATE ORDER ================= */
export const createOrder = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Payment screenshot required" });
    }

    // Upload payment screenshot to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "orders",
    });

    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    const items = JSON.parse(req.body.orderItems);
    if (!items || !items.length) {
      return res.status(400).json({ message: "Order items required" });
    }

    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error(`Product not found: ${item.productId}`);
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }
        return {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
        };
      })
    );

    const order = await Order.create({
      user: req.user._id,
      name: req.body.name,
      mobile: req.body.mobile,
      shippingAddress: req.body.shippingAddress,
      orderItems,
      totalAmount: req.body.totalAmount,
      paymentScreenshot: uploadResult.secure_url,
    });

    // Reduce product stock
    for (const item of orderItems) {
      const product = await Product.findById(item.productId);
      product.stock -= item.quantity;
      await product.save();
    }

    // Notify admin
    sendOrderNotification(order);

    res.status(201).json(order);
  } catch (error) {
    console.error("🔥 Create Order Error:", error);
    res.status(500).json({ message: error.message || "Failed to create order" });
  }
};

/* ================= GET ALL USER ORDERS ================= */
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("orderItems.productId", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("🔥 Error fetching user orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/* ================= GET ORDER BY ID ================= */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("orderItems.productId", "name price");

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    console.error("🔥 Error fetching order by ID:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

/* ================= GET ALL ORDERS (ADMIN) ================= */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.productId", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("🔥 Error fetching all orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/* ================= UPDATE ORDER STATUS ================= */
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = req.body.orderStatus;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error("🔥 Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

/* ================= UPDATE PAYMENT STATUS ================= */
export const updatePaymentStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = req.body.paymentStatus;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error("🔥 Error updating payment status:", error);
    res.status(500).json({ message: "Failed to update payment status" });
  }
};

/* ================= CANCEL ORDER ================= */
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.orderStatus !== "Processing") {
      return res.status(400).json({ message: "Cannot cancel this order" });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    // Restore product stock
    for (const item of order.orderItems) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("🔥 Error cancelling order:", error);
    res.status(500).json({ message: "Failed to cancel order" });
  }
};
