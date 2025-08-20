// controllers/offer.controller.js
import Offer from "../models/offer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";

// ✅ Create new offer (admin)
export const createOffer = asyncHandler(async (req, res) => {
  const newOffer = await Offer.create(req.body);
  res.status(201).json({ success: true, data: newOffer });
});

// ✅ Get all offers (public)
export const getAllOffers = asyncHandler(async (req, res) => {
  const offers = await Offer.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: offers });
});

// ✅ Update offer by ID (admin)
export const updateOfferById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedOffer = await Offer.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedOffer) {
    throw new ApiError(404, "Offer not found");
  }

  res.status(200).json({ success: true, data: updatedOffer });
});

// ✅ Delete offer by ID (admin)
export const deleteOfferById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await Offer.findByIdAndDelete(id);

  if (!deleted) {
    throw new ApiError(404, "Offer not found or already deleted");
  }

  res.status(200).json({ success: true, message: "Offer deleted successfully" });
});

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;

  if (!code) {
    throw new ApiError(400, "Coupon code is required");
  }

  const offer = await Offer.findOne({ code }); 
  if (!offer) {
    throw new ApiError(404, "Invalid coupon code");
  }

  if (new Date() > new Date(offer.validTill)) {
    throw new ApiError(400, "Coupon expired");
  }

  return res.status(200).json({
    success: true,
    data: {
      discountAmount: offer.discount,
      code: offer.code,
    },
    message: "Coupon applied successfully"
  });
});

