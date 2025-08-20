import express from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from '../middlewares/admin.middleware.js';

import { createOrUpdateReview, getAllReviewsByVilla, deleteReview, toggleLike, getAllReviewsForAdmin, approveOrEditReview, deleteReviewByAdmin, countReviewPerVilla} from "../controllers/review.controllers.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

// PUBLIC ROUTES - No authentication required
router.get("/villa/:villaId", getAllReviewsByVilla);
router.get("/villa-review-stats", countReviewPerVilla); // Made public for Explore page

// PROTECTED ROUTES - Authentication required
router.post("/like/:villaId",verifyJWT,toggleLike)
router.post("/rate-comment/:villaId",verifyJWT,upload.array("experienceImages",3), createOrUpdateReview)
router.get("/admin/all", verifyJWT, isAdmin, getAllReviewsForAdmin);
router.put("/admin/edit/:reviewId", verifyJWT, isAdmin,upload.array("experienceImages", 3), approveOrEditReview);
router.delete("/admin/delete/:reviewId", verifyJWT, isAdmin, deleteReviewByAdmin);
router.delete("/delete-review/:reviewId",verifyJWT,deleteReview)

export default router;
