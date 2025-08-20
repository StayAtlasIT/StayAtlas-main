// routes/offer.routes.js
import express from "express";
import {
  createOffer,
  getAllOffers,
  updateOfferById,
  deleteOfferById,
  validateCoupon,
} from "../controllers/offer.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

// Admin Routes
router.post("/", verifyJWT, isAdmin, createOffer);
router.put("/:id", verifyJWT, isAdmin, updateOfferById);
router.delete("/:id", verifyJWT, isAdmin, deleteOfferById);

// Public Route
router.get("/", getAllOffers);
router.post("/validate", verifyJWT, validateCoupon);


export default router;
