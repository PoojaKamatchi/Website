import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    discount: { type: Number, required: true },
    image: { type: String }, // URL or uploaded file
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Offer", offerSchema);
