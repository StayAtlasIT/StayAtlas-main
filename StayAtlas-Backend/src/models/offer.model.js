// models/Offer.js
import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: String,
  description: String,
  validTill: Date,
  code: { type: String, required: true, unique: true },
  discount: String,
  type: { type: String, enum: ["wallet", "stay", "all"], default: "all" },
  gradient: String,
  icon: String, // example: 'plane', 'wallet', etc.
}, { timestamps: true });

export default mongoose.model("Offer", offerSchema);
