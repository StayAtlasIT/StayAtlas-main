// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { ApiError } from "../utils/ApiError.js";
// import { ExperienceReview } from "../models/experiencereview.model.js";
// import { uploadMultipleImagesParallel } from "../utils/cloudinary.js"; // or your upload util

// export const createReview = asyncHandler(async (req, res) => {
//   const {
//     rating,
//     description,
//     experienceType,
//     experienceId,
//   } = req.body;

//   const {villaId} = req.params
//   // Validate input
//   if (!rating || (!experienceId )) {
//     throw new ApiError(400, "Rating and either experience ID or site review flag are required");
//   }

//   // Duplicate check
  
//     if (!experienceType || !experienceId) {
//       throw new ApiError(400, "Experience type and ID are required.");
//     }

//     const existingExperienceReview = await ExperienceReview.findOne({
//       user: req.user._id,
//       experienceType,
//       experienceId,
//     });

//     if (existingExperienceReview) {
//       throw new ApiError(400, "You have already reviewed this experience.");
//     }


//   // Handle file uploads if files are provided
//   let uploadedPhotos = [];
//   if (req.files && req.files.length > 0) {
//     const localPathArray = req.files.map(file => file.path);

//     const cloudinaryResponse = await uploadMultipleImagesParallel(localPathArray);

//     if (cloudinaryResponse.length < req.files.length) {
//       return res.status(400).json(
//         new ApiResponse(
//           400,
//           {
//             failedUploads: req.files.length - cloudinaryResponse.length,
//           },
//           "Some images failed to upload. Please try again."
//         )
//       );
//     }

//     uploadedPhotos = cloudinaryResponse.map(res => res.secure_url);
//   }

//   //  Create the review
//   const review = await ExperienceReview.create({
//     user: req.user._id,
//     rating,
//     description,
//     villaId,
//     photos: uploadedPhotos,
//     experienceType: experienceType,
//     experienceId: experienceId,
//   });

//   return res.status(201).json(new ApiResponse(201, review, "Review created successfully"));
// });



// // @desc    Get all reviews for a specific villa (hotel/villa)
// // @route   GET /api/v1/reviews/villa/:villaId
// // @access  Public

// export const getExperienceReview = asyncHandler(async (req, res) => {
//   const { reviewId } = req.params;

//   const reviews = await ExperienceReview.find({
//     _id:reviewId,
//     approved:true
//   })
//     .populate("user", "name avatar")
//     .sort({ createdAt: -1 });

//   res.status(200).json(new ApiResponse(200, reviews));
// });

// export const getExperienceReviewsByVilla = asyncHandler(async (req, res) => {
//   const { villaId } = req.params;

//   const reviews = await ExperienceReview.find({
//     approved:true,
//     villa: villaId,
//   })
//     .populate("user", "name avatar")
//     .sort({ createdAt: -1 });

//   res.status(200).json(new ApiResponse(200, reviews));
// });

// export const getAllExperienceReviewsForAdmin = asyncHandler(async (req, res) => {
//   const reviews = await ExperienceReview.find({})
//     .populate("user", "name avatar")
//     .populate("villa", "title")
//     .sort({ createdAt: -1 });

//   res.status(200).json(new ApiResponse(200, reviews, "All reviews in system"));
// });

// export const updateApproval = asyncHandler(async (req, res) => {
//   const {reviewId} = req.params;
//   const {approved} = req.body;
//   const {userId} = req.user._id
//   await ExperienceReview.findByIdandUpdate({id:reviewId},{
//     approved:approved,
//     approvedby:userId
//   })


//   res.status(200).json(new ApiResponse(200, reviews, "All reviews in system"));
// });
