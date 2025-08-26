import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkIfBannedUser } from "../middlewares/checkIfBannedUser.js";
import { 
    changeCurrentPassword, 
    forgotPassword, 
    getUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    registerUser, 
    resetPassword, 
    getEmailByPhone,
    updateUserName, 
    handleNotifications, 
    editProfile ,
    getAllUsersWithBookings,
    toggleUserBanStatus,
    deleteUser,
    sendOtp,
    verifyOtp,
    getLikedVillas,
    handleGoogleOAuthCallback,
    updateContact,
    sendContactEmail
} from "../controllers/user.controller.js";

const router = Router()

// Public routes
router.route("/register").post(registerUser)
router.route("/login").post(checkIfBannedUser,loginUser)
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.post("/email-by-phone", getEmailByPhone);
router.route("/send-otp").post(sendOtp);
router.route("/verify-otp").post(verifyOtp);

// NEW ROUTE: Google OAuth Callback
// This route receives the authorization code from Google
router.route("/google-callback").get(handleGoogleOAuthCallback);


// Secured routes (require verifyJWT middleware)
router.route("/getuser").get(verifyJWT,getUser)
router.route("/logout").post(verifyJWT,logoutUser)
// Allow refreshing without a valid access token (uses refreshToken cookie/body)
//router.route("/refreshToken").post(verifyJWT,refreshAccessToken)
router.route("/refreshToken").post(refreshAccessToken)
router.route("/changePassword").post(verifyJWT,changeCurrentPassword)
router.route("/change-name").post(verifyJWT,updateUserName)
router.route("/profile/edit").post(verifyJWT,editProfile);

router.post('/contact', verifyJWT, sendContactEmail);

// Get all users with booking info
router.get("/users", verifyJWT, getAllUsersWithBookings);

// Ban/unban user
router.patch("/users/:id/toggle-ban", verifyJWT, toggleUserBanStatus);

// delete from db after ban user
router.delete("/users/:id", deleteUser);
 
router.route("/notifications").get(verifyJWT, handleNotifications);
router.route("/notifications").put(verifyJWT, handleNotifications);
router.route("/notifications").delete(verifyJWT, handleNotifications);
router.route("/update-contact").post(verifyJWT, updateContact);

router.get("/liked-villas", verifyJWT, getLikedVillas);

export default router
