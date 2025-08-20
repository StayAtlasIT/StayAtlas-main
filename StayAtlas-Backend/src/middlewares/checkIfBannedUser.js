import { ApiError } from "../utils/ApiError.js";

export const checkIfBannedUser = (req, res, next) => {
  const user = req.user; // populated by verifyJWT

  if (user?.isBanned) {
    throw new ApiError(403, `You are banned from performing this action. Reason: ${user.banReason || "No reason provided"}`);
  }

  next();
};
