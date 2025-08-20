import { Router } from "express";
import multer from "multer";
import {
    ApprovePendingVillas,
    deleteVillaById,
    deleteVillaByAdmin,
    rejectVillaByAdmin,
    editVillaDetailsById,
    getAllApprovedVillas,
    getAllPendingVillas,
    getAllRejectedVillas,
    getUserCount,
    reviewPendingVillas,
    totalCountOfVillasByApprovalStatus,
    approvePendingBookingById,
    rejectPendingBookingById,
    updateVillaPricing,
    getAllReviewOfAllVillaByUser,
    approveOrRejectReview,
    getMonthlyUserStats,
    getMonthlyVillaStats,
    getBookingStatusStats,
    getBookingRevenueStats,
    uploadRealMomentVideo 
} from "../controllers/adminAction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.use(verifyJWT);
router.use(isAdmin);

// Multer setup for video uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype?.startsWith("video/")) return cb(null, true);
        cb(new Error("Invalid file type, only video/* allowed"), false);
    },
});

// Video upload route
router.post(
    "/upload-real-moment-video",
    upload.single("video"), // field name must be "video"
    uploadRealMomentVideo
);

// Existing routes...
router.route("/get-all-pending-villa").get(getAllPendingVillas);
router.route("/get-all-approved-villa").get(getAllApprovedVillas);
router.route("/get-all-rejected-villa").get(getAllRejectedVillas);
router.route("/review-pending-villa/:id").get(reviewPendingVillas);
router.route("/approve-pending-villa/:id").post(ApprovePendingVillas);
router.route("/edit-villaById/:id").post(editVillaDetailsById);
router.route("/delete-villaById/:id").post(deleteVillaById);
router.delete("/villas/:villaId", verifyJWT, isAdmin, deleteVillaByAdmin);
router.put("/villas/:villaId/reject", verifyJWT, isAdmin, rejectVillaByAdmin);
router.route("/villa-count").get(totalCountOfVillasByApprovalStatus);
router.route("/user-count").get(getUserCount);
router.get("/stats/monthly-users", verifyJWT, isAdmin, getMonthlyUserStats);
router.get("/stats/monthly-villas", verifyJWT, isAdmin, getMonthlyVillaStats);
router.get("/booking-status-stats", getBookingStatusStats);
router.get("/booking-revenue-stats", getBookingRevenueStats);
router.route("/pricing/:villaId").put(updateVillaPricing);
router.route("/get-review").get(getAllReviewOfAllVillaByUser);
router.route("/review/reject-approve/:reviewId").post(approveOrRejectReview);

// accept user booking or reject
router.route("/accept-user-booking/:id").post(approvePendingBookingById);
router.route("/reject-user-booking/:id").post(rejectPendingBookingById);

export default router;
