import { ApiError } from "../utils/ApiError.js"

export const isAdmin = (req,res,next)=>{
  const user = req.user 
  if(!user){
    throw new ApiError(401,"Unauthorized: User not authenticated")
  }

  if (user.role !== 'admin') {
    throw new ApiError(403,"Forbidden: Admin access only")
  }

  next(); // User is admin, allow access
}