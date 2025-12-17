import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // optional reference
      },
    ],
    shippingAddress: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, default: "UPI" },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    paymentScreenshot: { type: String, required: true },
    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    cancelledBy: String,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
