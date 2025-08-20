import Booking from "../models/booking.model.js"
import { VillaLike } from "../models/review.model.js"
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { VillaReview } from "../models/review.model.js"
import { uploadMultipleImagesParallel } from "../utils/cloudinary.js"
import { reviewSchema } from "../validators/review.validator.js"
import fs from "fs"
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary.js"

// export const updateVillaRatingAndReviewCount = async (villaId) => {
//   const reviews = await VillaReview.find({ villa: villaId, status: "approved" });

//   const averageRating =
//     reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0;

//   await Villa.findByIdAndUpdate(
//     villaId,
//     {
//       averageRating: averageRating.toFixed(1),
//       reviewCount: reviews.length,
//     },
//     { new: true }
//   );
// };

const toggleLike = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const villaId = req.params.villaId
    const like = await VillaLike.findOne({ user: userId, villa: villaId })
    if (like) {
        await like.deleteOne()
        return res.status(200).json(new ApiResponse(200, {}, "Villa unliked"))
    } else {
        await VillaLike.create({ user: userId, villa: villaId })
        return res.status(200).json(new ApiResponse(200, {}, "Villa like"))
    }
})

const createOrUpdateReview = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const villaId = req.params.villaId
    const { rating, title, description } = req.body
    const files = req.files

    const deleteLocalFiles = () => {
        files.forEach((file) => {
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path)
        })
    }

    const parseResult = reviewSchema.safeParse({ rating, title, description })

    if (!parseResult.success) {
        deleteLocalFiles()

        // Return first error message
        const firstError =
            parseResult.error.issues[0]?.message || "Invalid input"

        return res.status(400).json(new ApiResponse(400, {}, firstError))
    }
    const visited = await Booking.findOne({
        user: userId,
        villa: villaId,
        status: "Completed"
    })

    if (!visited) {
        return res
            .status(403)
            .json(
                new ApiResponse(
                    403,
                    {},
                    "You must visit the villa before reviewing it"
                )
            )
    }
    const localPathArray = files.map((file) => file.path)

    const cloudinaryResponse = await uploadMultipleImagesParallel(
        localPathArray,
        "experience"
    )
    //console.log("cloudinaryResponse:",cloudinaryResponse)
    if (cloudinaryResponse.length < req.files.length) {
        return res.status(400).json(
            new ApiResponse(
                200,
                {
                    failedUploads: req.files.length - cloudinaryResponse.length
                },
                "Some images failed to upload. Please try again."
            )
        )
    }
    const publicUrls = cloudinaryResponse.map((res) => res.secure_url)

    let review = await VillaReview.findOne({ user: userId, villa: villaId })

    if (review) {
        review.rating = rating
        review.title = title
        review.description = description
        review.experienceImages = publicUrls

        await review.save()

        // await updateVillaRatingAndReviewCount(villaId);

        return res
            .status(200)
            .json(new ApiResponse(200, review, "Review updated"))
    }

    // Create new review
    review = await VillaReview.create({
        user: userId,
        villa: villaId,
        rating,
        title,
        description,
        experienceImages: publicUrls,
    })

    // await updateVillaRatingAndReviewCount(villaId);

    return res
        .status(201)
        .json(new ApiResponse(201, review, "Review created successfully"))
})

const getAllReviewsByVilla = asyncHandler(async (req, res) => {
    const villaId = req.params.villaId

    const reviews = await VillaReview.find({ villa: villaId }).populate(
        "user",
        "firstName lastName"
    )

    return res
        .status(200)
        .json(new ApiResponse(200, reviews, "All reviews fetched"))
})

// 1. Get All Reviews (Admin)
export const getAllReviewsForAdmin = asyncHandler(async (req, res) => {
  const reviews = await VillaReview.find()
    .populate("user", "firstName lastName")
    .populate("villa", "villaName");

  res.status(200).json(new ApiResponse(200, reviews, "Fetched all reviews"));
});


// 2. Approve or Edit Review (Admin)
export const approveOrEditReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { title, description, rating, approve, deleteImages = [] } = req.body;

  const review = await VillaReview.findById(reviewId);
  if (!review) throw new Error("Review not found");

  // Delete selected images from Cloudinary
  if (deleteImages.length > 0) {
    await deleteFromCloudinary(deleteImages, "experience");
    review.experienceImages = review.experienceImages.filter(
      (img) => !deleteImages.includes(img)
    );
  }

  // Upload new images using multer files
  if (req.files && req.files.length > 0) {
    const localPathArray = req.files.map((file) => file.path);

    const cloudinaryResponse = await uploadMultipleImagesParallel(
      localPathArray,
      "experience"
    );

    // Handle failed uploads
    if (cloudinaryResponse.length < req.files.length) {
      return res.status(400).json(
        new ApiResponse(
          400,
          { failedUploads: req.files.length - cloudinaryResponse.length },
          "Some images failed to upload. Please try again."
        )
      );
    }

    const newImageUrls = cloudinaryResponse.map((res) => res.secure_url);
    review.experienceImages.push(...newImageUrls);
  }

  // Update review fields
  review.title = title || review.title;
  review.description = description || review.description;
  review.rating = rating || review.rating;
  review.status = approve ? "approved" : review.status;

    //  Push notification to the user
  const user = await User.findById(review.user);
  if (user) {
    console.log("Notifying user:", user.firstName, user._id);

    user.notifications.push({
      message: "Your review has been updated and approved by the admin.",
      isRead: false,
      date: new Date(),
    });
    await user.save();
  }

  await review.save();
  res.status(200).json(new ApiResponse(200, review, "Review updated and approved"));
});


// 3. Delete Review by Admin
export const deleteReviewByAdmin = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const review = await VillaReview.findById(reviewId);
  if (!review) throw new Error("Review not found");

  // Delete all images from Cloudinary
  await deleteFromCloudinary(review.experienceImages, "experience");

  await review.deleteOne();

  res.status(200).json(new ApiResponse(200, {}, "Review deleted successfully"));
});


const deleteReview = asyncHandler(async (req, res) => {
    const reviewId = req.params.reviewId
    const userId = req.user._id

    const review = await VillaReview.findById(reviewId)

    if (!review) {
        return res
            .status(404)
            .json(new ApiResponse(404, {}, "Review not found"))
    }

    if (!review.user.equals(userId)) {
        return res
            .status(403)
            .json(
                new ApiResponse(
                    403,
                    {},
                    "You are not authorized to delete this review"
                )
            )
    }
    const response = await deleteFromCloudinary(
        review.experienceImages,
        "experience"
    )
    const allDeleted = response.every(
        (r) => r.status === "ok" || r.status === "not found"
    )

    if (allDeleted) {
        await review.deleteOne()
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Review deleted successfully"))
    } else {
        return res
            .status(500)
            .json(
                new ApiResponse(
                    500,
                    { deleteResult },
                    "Failed to delete all images"
                )
            )
    }
})


const countReviewPerVilla = asyncHandler(async (req, res) => {
  const counts = await VillaReview.aggregate([
    {
      $match: { status: "approved" } 
    },
    {
      $group: {
        _id: "$villa",               
        reviewCount: { $sum: 1 },   
        averageRating: { $avg: "$rating" } 
      }
    },
    {
      $lookup: {
        from: "villas",             // Join with villas collection
        localField: "_id",
        foreignField: "_id",
        as: "villaDetails"
      }
    },
    {
      $unwind: "$villaDetails"
    },
    {
      $project: {
        _id: 0,
        villaId: "$_id",
        villaName: "$villaDetails.villaName", 
        reviewCount: 1,
        averageRating: { $round: ["$averageRating", 1] } 
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: counts
  });
});


export { toggleLike, createOrUpdateReview, getAllReviewsByVilla, deleteReview ,countReviewPerVilla}
