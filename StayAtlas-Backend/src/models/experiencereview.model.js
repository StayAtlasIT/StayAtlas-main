// import mongoose from "mongoose";

// const experienceReviewSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
    
//     villa: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Villa",
//       required: function() { return !this.isSiteReview },  // Only required if it's not a site review
//     },

//     rating: {
//       type: Number,
//       min: 1,
//       max: 5,
//       required: true,
//     },

//     description: {
//       type: String,
//       trim: true,
//       maxlength: 4000,
//     },

//     photos: {
//       type: [String], // Array of image URLs
//       validate: {
//         validator: function (val) {
//           return val.length <= 10; // Max 10 photos per review
//         },
//         message: "You can upload up to 10 photos only.",
//       },
//     },

//     avatar: {
//       type: String,
//       default: "",
//     },

//     experienceType: {
//       type: String,
//       enum: ["villa", "site", "service", "trip", "other"],
//       default: "other",
//     },

//     experienceId: {
//       type: mongoose.Schema.Types.ObjectId,
//       refPath: "experienceType", // Will reference dynamic model based on experienceType
//     },

//     approved: {
//         type: Boolean,
//     },

//     approvedBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     }
//   },
//   { timestamps: true }
// );



// // Optional: one review per user per experience
// experienceReviewSchema.index(
//   { user: 1, experienceId: 1, experienceType: 1 },
//   { unique: true, partialFilterExpression: { experienceId: { $exists: true } } }
// );

// export const ExperienceReview = mongoose.model("ExperienceReview", experienceReviewSchema);
