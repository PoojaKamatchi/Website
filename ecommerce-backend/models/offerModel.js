import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    discount: { type: Number, required: true }, // % or fixed amount
    image: { type: String }, // optional banner image
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Offer", offerSchema);
