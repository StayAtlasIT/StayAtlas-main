import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import sendEmail from "../utils/sendEmail.js"
import crypto from "crypto"
import { Villa } from "../models/villa.model.js"
import { VillaLike } from "../models/review.model.js"
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';

dotenv.config()

const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

const generateAccessAndRefreshToken = async function (userId) {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(404, "User not found for token generation");
        }
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (err) {
        throw new ApiError(
            500,
            `something went wrong while generating access and refresh token Err:${err.message}`
        )
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, phoneNumber, dob, password, email } = req.body

    const baseUsername = email.split('@')[0];
    const username = `${baseUsername.toLowerCase().replace(/[^a-z0-9]/g, '')}${Math.random().toString(36).substring(2, 7)}`;

    if (
        [firstName, lastName, phoneNumber, dob, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All filed are required")
    }
    if (!email || email.trim() === "") {
        throw new ApiError(400, "Email is required");
    }

    const existedUserByEmail = await User.findOne({ email });
    if (existedUserByEmail) {
        throw new ApiError(400, "User with this email already exists");
    }

    // Check for existing user by phone number
    const existedUser = await User.findOne({ phoneNumber })
    if (existedUser) {
        throw new ApiError(400, "User with same phoneNumber already exists")
    }

    
    const existedUserByUsername = await User.findOne({ username });
    if (existedUserByUsername) {
        throw new ApiError(409, "Generated username already exists, please try again.");
    }


    const user = await User.create({
        firstName,
        lastName,
        dob,
        phoneNumber,
        password,
        email: email,
        authProvider: 'local',
        username: username, 
        role: 'defaultUser', 
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )


    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        createdUser._id
    )

    const isProduction = process.env.NODE_ENV === "production"
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax"
    }

    return res
        .status(201)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user: createdUser.toObject(),
                    accessToken,
                    refreshToken
                },
                "Registration Successful"
            )
        )
})

const loginUser = asyncHandler(async (req, res) => {
    const { phoneNumber, password } = req.body

    if (!phoneNumber || !password) {
        throw new ApiError(400, "phoneNumber or password is required")
    }

    const user = await User.findOne({ phoneNumber })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

      if (user.isBanned) {
    throw new ApiError(
      403,
      `You are banned from logging in. Reason: ${user.banReason || "No reason provided"}`
    );
  }
    if (user.authProvider !== 'local' || !user.password) {
        throw new ApiError(401, "Please use 'Continue with Google' or contact support if you registered via social login.");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
    )

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const isProduction = process.env.NODE_ENV === "production"
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax"
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser.toObject(),
                    accessToken,
                    refreshToken,
                    isBanned: user.isBanned,
                },
                "User loggedIn successfully"
            )
        )
})

const getUser = async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "User not authenticated.");
        }
        res.status(200).json({
            user: req.user.toObject(),
            message: "User fetched successfully"
        })
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            statusCode: err.statusCode || 500,
            success: false,
            message: err.message || "Internal server error"
        })
    }
}

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const isProduction = process.env.NODE_ENV === "production";
    const options = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax"
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const isProduction = process.env.NODE_ENV === "production";
        const options = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "None" : "Lax"
        }

        const { accessToken, refreshToken: newRefreshToken } =
            await generateAccessAndRefreshToken(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)
    if (user.authProvider !== 'local' || !user.password) {
        throw new ApiError(400, "Password cannot be changed for social login users.");
    }
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const updateUserName = asyncHandler(async (req, res) => {
    const { newFirstName, newLastName } = req.body
    const user = req.user
    if (!newFirstName || !newLastName) {
        throw new ApiError(400, "new field are required!!")
    }
    user.firstName = newFirstName
    user.lastName = newLastName

    await user.save()

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Details updated successfully"))
})

const forgotPassword = asyncHandler(async (req, res) => {
    console.log("Request Body:", req.body)
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"))
    }
    if (user.authProvider !== 'local' || !user.password) {
        throw new ApiError(400, "Password reset not applicable for social login users.");
    }

    const resetToken = user.getResetPasswordToken()
    await user.save({ validateBeforeSave: false })

   const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const message = `You requested a password reset. Click the link below to reset it:\n\n${resetUrl}`

    try {
        await sendEmail({
            to: user.email,
            subject: "Password Reset",
            text: message
        })

        res.status(200).json(
            new ApiResponse(200, {}, "Reset link sent to your email")
        )
    } catch (err) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({ validateBeforeSave: false })

        throw new ApiError(500, "Email could not be sent")
    }
})

const resetPassword = asyncHandler(async (req, res) => {
    const resetToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex")

    const user = await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return res
            .status(400)
            .json(new ApiResponse(400, {}, "Invalid or expired token"))
    }

    const { password } = req.body

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    res.status(200).json(new ApiResponse(200, {}, "Password reset successful"))
})

const getEmailByPhone = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" }); // Fixed to return JSON
  }

  const user = await User.findOne({ phoneNumber });
  if (!user) {
    return res.status(404).json({ message: "User not found" }); // Fixed to return JSON
  }

  return res.status(200).json({ email: user.email, message: "Email fetched" }); // Fixed to return correct fields
});

const handleNotifications = async (req, res) => {
    const { action } = req.query

    try {
        const user = await User.findById(req.user.id)

        if (!user) return res.status(404).json({ message: "User not found" })

        if (req.method === "GET") {
            return res.json(user.notifications || [])
        }

        if (req.method === "PUT" && action === "read") {
            user.notifications.forEach((n) => (n.isRead = true))
            await user.save()
            return res.json({ message: "All marked as read" })
        }

        if (req.method === "DELETE" && action === "clear") {
            user.notifications = []
            await user.save()
            return res.json({ message: "All notifications cleared" })
        }

        return res.status(400).json({ message: "Invalid request" })
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Server error", error: err.message })
    }
}

const editProfile = asyncHandler(async (req, res) => {
    const user = req.user;
    const { name, phone, email } = req.body;

    const incoming = { name, phone, email };

    const updates = Object.fromEntries(
        Object.entries(incoming).filter(
            ([_, value]) => value != null && value !== ""
        )
    );

    if (Object.keys(updates).length === 0) {
        throw new ApiError(400, "No valid fields provided to update.");
    }

    let firstName = updates.name?.split(" ")[0];
    let lastName = updates.name?.split(" ")[1];
    
    firstName = firstName || user.firstName;
    lastName = lastName || user.lastName;

    const updateFields = { firstName, lastName };

    if (updates.phone && updates.phone !== user.phoneNumber) {
        const existedUserByPhone = await User.findOne({ phoneNumber: updates.phone });
        if (existedUserByPhone && String(existedUserByPhone._id) !== String(user._id)) {
            throw new ApiError(409, "User with this phone number already exists.");
        }
        updateFields.phoneNumber = updates.phone;
    }

    if (updates.email && updates.email !== user.email) {
        const existedUserByEmail = await User.findOne({ email: updates.email });
        if (existedUserByEmail && String(existedUserByEmail._id) !== String(user._id)) {
            throw new ApiError(409, "User with this email already exists.");
        }
        updateFields.email = email;
    }

    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
            $set: updateFields
        },
        { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!updatedUser) {
        throw new ApiError(500, "Failed to update user profile.");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedUser.toObject(),
                "Profile updated successfully"
            )
        );
});

let otpStore = {}

const sendOtp = asyncHandler(async (req, res) => {
    const { email, firstName, lastName, dob, password, phoneNumber } = req.body

    if (!email) {
        return res.status(400).json({ message: "Email is required" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return res
            .status(400)
            .json({ message: "User with this email already exists" })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    otpStore[email] = otp

    try {
        await sendEmail({
            to: email,
            subject: " StayAtlas OTP",
            html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 24px; background: #f9f9f9; border-radius: 10px; border: 1px solid #ddd;">
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="cid:logo" alt="StayAtlas Logo" style="width: 80px; margin-bottom: 10px;" />
    <h2 style="color: #006A4E; font-size: 24px; margin: 0;">Welcome to StayAtlas!</h2>
    <p style="color: #555;">Thanks for signing up</p>
  </div>

  <div style="background: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #006A4E; margin-bottom: 24px;">
    <h3 style="color: #333; margin-bottom: 8px;">Your One-Time Password (OTP)</h3>
    <div style="background-color: #f3f3f3; padding: 12px 18px; border-radius: 6px; border: 1px dashed #aaa; font-weight: bold; font-size: 22px; letter-spacing: 4px; font-family: monospace; text-align: center; color: #222;">
      ${otp}
    </div>
    <p style="font-size: 13px; color: #888; text-align: center; margin-top: 6px;">Please use this OTP within 10 minutes</p>
  </div>

  <div style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
    <h3 style="color: #333; margin-bottom: 12px;">Your Registration Details</h3>
    <table style="width: 100%; font-size: 15px; color: #333;">
     <tr>
        <td style="padding: 8px 0;"><strong>Full Name:</strong></td>
        <td style="padding: 8px 0;">${[firstName, lastName].filter(Boolean).join(" ") || "N/A"}</td>
    </tr>
      <tr>
        <td style="padding: 8px 0;"><strong>Email:</strong></td>
        <td style="padding: 8px 0;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0;"><strong>Phone No:</strong></td>
        <td style="padding: 8px 0;">${phoneNumber}</td>
      </tr>
    </table>
  </div>

  <p style="font-size: 13px; color: #777; margin-top: 20px; text-align: center;">
    This OTP is valid for the next 10 minutes. If you didn’t request this, please ignore this email.
  </p>

  <div style="text-align: center; margin-top: 24px;">
    <p style="color: #aaa; font-size: 13px;">&copy; ${new Date().getFullYear()} StayAtlas. All rights reserved.</p>
  </div>
</div>


      `,
            attachments: [
                {
                    filename: "stay-15xAdS51.jpg",
                    path: "./public/stay-15xAdS51.jpg", 
                    cid: "logo"
                }
            ]
        })

        console.log("OTP sent to:", email, "OTP:", otp)

        return res.status(200).json({
            statusCode: 200,
            message: "OTP sent successfully to email"
        })
    } catch (error) {
        console.error("Error sending OTP:", error)
        return res.status(500).json({ message: "Failed to send OTP" })
    }
});

const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" })
    }

    const storedOtp = otpStore[email]
    if (!storedOtp) {
        return res
            .status(400)
            .json({ message: "No OTP found. Please request again." })
    }

    if (storedOtp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" })
    }

    delete otpStore[email]

    return res.status(200).json({
        statusCode: 200,
        message: "OTP verified"
    })
});

const getAllUsersWithBookings = asyncHandler(async (req, res) => {
const users = await User.find()
    .populate({
      path: "bookingHistory",
      populate: {
        path: "villa",
        select: "villaName"
      }
    });
  res.json(users);
});

const toggleUserBanStatus = asyncHandler(async (req, res) => {
  try {
    console.log("Toggle Ban Request:", req.params.id, req.body); // 👈 log this

    const user = await User.findById(req.params.id);

    if (!user) {
      console.log("User not found"); // 👈 log if null
      return res.status(404).json({ message: "User not found" });
    }

    user.isBanned = !user.isBanned;

    if (user.isBanned) {
      user.banReason = req.body.reason || "Violation of policies";
      user.bannedAt = new Date();
    } else {
      user.banReason = "";
      user.bannedAt = null;
    }

   await user.save({ validateBeforeSave: false });

    res.status(200).json({
  success: true,
  message: `User is now ${user.isBanned ? "banned" : "active"}`,
  isBanned: user.isBanned,
  banReason: user.banReason,
  bannedAt: user.bannedAt, // ✅ add this
});

  } catch (err) {
    console.error("Toggle Ban Error:", err); // 👈 catch any error
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

export const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ message: "User deleted successfully" });
});

const getLikedVillas = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const liked = await VillaLike.find({ user: userId });
    const likedVillas = liked.map(like => like.villa.toString());
    return res.status(200).json({ success: true, likedVillas });
});

const getCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === "production";
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax", 
        // You might want to add 'maxAge' for session expiration, e.g.,
        // maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    };
};

const handleGoogleOAuthCallback = asyncHandler(async (req, res) => {
    const { code } = req.query;

    if (!code) {
        console.error("Google OAuth Callback Error: Authorization code is missing.");
        throw new ApiError(400, "Authorization code is missing.");
    }

    try {
        const { tokens } = await googleClient.getToken(code);
        console.log("Google Tokens received (backend):", tokens);

        const ticket = await googleClient.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        console.log("Google ID Token Payload (backend):", payload);

        const googleId = payload.sub;
        const email = payload.email;
        const firstName = payload.given_name;
        const lastName = payload.family_name;
        const picture = payload.picture;
        const emailVerified = payload.email_verified;

        if (!emailVerified) {
            throw new ApiError(401, "Google email not verified.");
        }

        let user = await User.findOne({ googleId: googleId });

        if (user) {
            console.log("Existing Google user found by googleId (backend):", user._id);
            if (user.authProvider !== 'google') {
                user.authProvider = 'google';
            }
            user.googleProfile = {
                id: googleId,
                email: email,
                firstName: firstName,
                lastName: lastName,
                picture: picture,
            };
            await user.save({ validateBeforeSave: false });

        } else {
            // If not found by googleId, try to find by email
            console.log("No user found by googleId. Checking for any user with this email (backend)...");
            user = await User.findOne({ email: email });

            if (user) {
                console.log("Existing user found by email (backend):", user._id, "Updating to link Google ID.");
                user.googleId = googleId;
                user.authProvider = 'google';
                user.googleProfile = {
                    id: googleId,
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    picture: picture,
                };
                if (user.password) {
                    user.password = undefined; // Remove password if linking existing manual account
                }
                user.refreshToken = undefined; // Clear old refresh token if any
                user.phoneNumber = user.phoneNumber || undefined;
                user.username = user.username || undefined;
                
                await user.save({ validateBeforeSave: false });
            } else {
                console.log("No existing user found by email. Creating new user with Google OAuth (backend).");
                user = await User.create({
                    googleId: googleId,
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    authProvider: 'google',
                    googleProfile: {
                        id: googleId,
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        picture: picture,
                    },
                    phoneNumber: undefined,
                    dob: undefined,
                    username: undefined,
                });
            }
            console.log("User created/linked (backend):", user._id);
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
            user._id
        );
        console.log("Backend-issued tokens generated (backend).");

        const cookieOptions = getCookieOptions(); // Get the consistent cookie options

        // Set cookies directly from the backend
        res.cookie("accessToken", accessToken, cookieOptions);
        res.cookie("refreshToken", refreshToken, cookieOptions);

        // Redirect to the main page or dashboard, not the login page with tokens
        // Ensure process.env.CLIENT_URL is correctly set to your frontend's base URL
        const frontendSuccessRedirectUrl = `${process.env.CLIENT_URL}`; // Or wherever your main app is
        console.log("Setting cookies and redirecting to frontend (backend):", frontendSuccessRedirectUrl);
        
        // Return a redirect response
        return res.redirect(frontendSuccessRedirectUrl);

    } catch (error) {
        console.error("Google OAuth Callback Error (backend):", error.message);
        if (error.response) {
            console.error("Google OAuth Callback Error Response Data (backend):", error.response.data);
            console.error("Google OAuth Callback Error Response Status (backend):", error.response.status);
        }
        const errorRedirectUrl = `${process.env.CLIENT_URL}/login?error=${encodeURIComponent(error.message || "Google authentication failed.")}`;
        return res.redirect(errorRedirectUrl);
    }
});

const updateContact = asyncHandler(async (req, res) => {
   
    const { userPhone } = req.body;

   
    if (!userPhone) {
        throw new ApiError(400, "Contact number is required");
    }

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                phoneNumber: userPhone
            }
        },
        { new: true, runValidators: true } 
    );

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "Contact number updated successfully"));
});

export const sendContactEmail = asyncHandler(async (req, res) => {
  const { fullName, email, mobile, message } = req.body;

  if (!fullName || !email || !mobile || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    // 1️⃣ Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // admin email
        pass: process.env.SMTP_PASS, // app password
      },
    });
    // console.log("SMTP_HOST:", process.env.SMTP_HOST);
    // console.log("SMTP_PORT:", process.env.SMTP_PORT);
    // console.log("SMTP_USER:", process.env.SMTP_USER);


    // Mail options
    const mailOptions = {
      from: `"${fullName}" <${email}>`, // sender user
      to: process.env.ADMIN_EMAIL, // admin email
      subject: `New Contact Form Message from ${fullName}`,
      text: message,
      html: `<p><strong>Name:</strong> ${fullName}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone No.:</strong> ${mobile}</p>
             <p><strong>Message:</strong><br/>${message}</p>`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getUser,
    updateUserName,
    forgotPassword,
    resetPassword,
    getEmailByPhone,
    handleNotifications,
    editProfile,
    sendOtp,
    verifyOtp,
    getAllUsersWithBookings,
    toggleUserBanStatus,
    getLikedVillas,
    handleGoogleOAuthCallback,
    getCookieOptions,
    updateContact
}
