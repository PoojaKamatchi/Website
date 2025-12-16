import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: String,
    mobile: String,

    orderItems: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],

    shippingAddress: String,
    totalAmount: Number,

    paymentMethod: {
      type: String,
      default: "UPI",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    paymentScreenshot: {
      type: String,
      default: "",
    },

    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },

    cancelledBy: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
