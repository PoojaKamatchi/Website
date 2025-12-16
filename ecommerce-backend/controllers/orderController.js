import Order from "../models/orderModel.js";

/* ================= CREATE ORDER ================= */
export const createOrder = async (req, res) => {
  try {
    const order = await Order.create({
      user: req.user._id,
      ...req.body,
      paymentMethod: "UPI",
      paymentStatus: "Pending",
      orderStatus: "Processing",
    });

    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= USER ORDERS ================= */
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= USER CANCEL ================= */
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.orderStatus !== "Processing") {
      return res.status(400).json({ message: "Cannot cancel this order" });
    }

    order.orderStatus = "Cancelled";
    order.cancelledBy = "USER";
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= ADMIN ORDERS ================= */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= ADMIN UPDATE STATUS ================= */
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

/* ================= ADMIN PAYMENT ACTION ================= */
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
