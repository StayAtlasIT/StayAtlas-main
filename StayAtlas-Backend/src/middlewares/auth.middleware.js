import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
import dotenv from "dotenv"
dotenv.config()
export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        // console.log("here");
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        //console.log("Token:",token)
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        // console.log("Decoded Token:",decodedToken)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }   
})
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODE5ZTAxZDI2YzY0Nzk2NzUwMzY1NWUiLCJpYXQiOjE3NDY1MjYyMzcsImV4cCI6MTc0NzM5MDIzN30.rJ6FAAaFQo8scja0FdckDt7iqn1Rc54_wN8q_DkLjEg