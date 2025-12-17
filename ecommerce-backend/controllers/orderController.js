import Order from "../models/orderModel.js";
import cloudinary from "../config/cloudinary.js";

export const createOrder = async (req, res) => {
  try {
    let screenshotUrl = "";
    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "order_screenshots",
      });
      screenshotUrl = result.secure_url;
    }

    const order = await Order.create({
      user: req.user._id,
      ...req.body,
      paymentScreenshot: screenshotUrl,
      paymentMethod: "UPI",
      paymentStatus: "Pending",
      orderStatus: "Processing",
    });

    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = "Cancelled";
    order.cancelledBy = "USER";
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
