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

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `${product.name?.en || product.name} out of stock`,
        });
      }

      product.stock -= item.quantity;
      await product.save();

      orderItems.push({
        name: product.name?.en || product.name,
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
      paymentStatus: "Pending",
      orderStatus: "Processing",
      paymentScreenshot: `/uploads/${req.file.filename}`,
    });

    // ✅ SEND MAIL TO ADMIN
    await sendOrderNotification(order);

    res.status(201).json(order);
  } catch (err) {
    console.error("Create Order Error:", err);
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
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ allow admin OR owner
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= CANCEL ORDER ================= */
export const cancelOrderByUser = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus !== "Processing") {
      return res.status(400).json({ message: "Cannot cancel this order" });
    }

    order.orderStatus = "Cancelled";
    order.cancelledBy = "USER";
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= ADMIN ================= */
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

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = req.body.status;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = req.body.paymentStatus;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
