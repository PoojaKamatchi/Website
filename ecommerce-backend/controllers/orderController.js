import Order from "../models/orderModel.js";

/* ================= CREATE ORDER ================= */
export const createOrder = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Payment screenshot required" });
    }

    // Parse order items safely
    let items;
    try {
      items = JSON.parse(req.body.orderItems);
      if (!Array.isArray(items) || !items.length) throw new Error();
    } catch {
      return res.status(400).json({ message: "Invalid order items" });
    }

    const order = await Order.create({
      user: req.user._id,
      name: req.body.name,
      mobile: req.body.mobile,
      orderItems: items,
      shippingAddress: req.body.shippingAddress,
      totalAmount: req.body.totalAmount,
      paymentScreenshot: `/uploads/${req.file.filename}`,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= USER ORDERS ================= */
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(orders);
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

/* ================= ADMIN STATUS ================= */
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

/* ================= PAYMENT APPROVE ================= */
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
