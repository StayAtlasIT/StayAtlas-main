import express from "express";
import {
  createVilla,
  updateVilla,
  deleteVilla,
  getAllApprovedVillas,
  getApprovedVillaById,
  getMyVillas,
  getExclusiveVilla,
  getRecentlyViewed,
  getAvailableWeekendVillas,
  searchVillas,
} from "../controllers/villa.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import { canListVilla } from "../middlewares/villaOwner.middleware.js";
import { parseAddressBody } from "../middlewares/parse.address.middleware.js";

const router = express.Router();

// PROTECTED ROUTES
router.post("/create-villa", verifyJWT, canListVilla, upload.array('images',60),createVilla); // Owner can create
router.get("/my-villas", verifyJWT, getMyVillas);
router.get('/recently-viewed', verifyJWT, getRecentlyViewed);
router.put("/:id", verifyJWT, updateVilla); // Owner  can update
router.delete("/:id", verifyJWT, deleteVilla); // Owner can delete

// GET: /api/v1/villas/search?location=Mumbai&start=2025-08-15&end=2025-08-18&guests=4
router.get("/search", searchVillas);

// PUBLIC ROUTES - No authentication required
router.get("/", getAllApprovedVillas); // All approved and non-deleted villas
router.get("/get-exclusive-villa",getExclusiveVilla)
router.get("/available-weekend", getAvailableWeekendVillas);
router.get("/:id", getApprovedVillaById); // Approved villa by ID

export default router;
