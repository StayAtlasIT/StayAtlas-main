import { Villa } from "../models/villa.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const isVillaOwner = asyncHandler(async (req, res, next) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized: User not authenticated");
    }

    if (user.role !== "villaOwner") {
        throw new ApiError(403, "Forbidden: villaOwner access only");
    }
    next();
});

const canListVilla = asyncHandler(async (req, res, next) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized: User not authenticated");
    }

    const count = await Villa.countDocuments({ ownerId: user._id });
    // console.log(count)
    // console.log("count of villa", count)
    // console.log(user.role)
    if (user.role === "defaultUser" && count=== 0) {
        return next();
    }

    if (user.role === "villaOwner") {
        return next();
    }

    throw new ApiError(403, "Forbidden: You are not allowed to list a villa Until your first villa get approved");
});

export{
    canListVilla,
    isVillaOwner
}
