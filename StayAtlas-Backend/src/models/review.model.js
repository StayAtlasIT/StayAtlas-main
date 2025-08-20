import mongoose from "mongoose";


const reviewSchemaOfVilla = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    villa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Villa",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: [1, "Minimum rating is 1"],
      max: [5, "Maximum rating is 5"],
    },

    title: {
      type: String,
      trim: true,
      maxlength: [100, "Title can't exceed 100 characters"],
      required: [true, "Please provide a review title"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description can't exceed 2000 characters"],
    },

    experienceImages: {
      type: [String], // Array of image URLs or paths
      validate: {
      validator: function (val) {
        return val.length <= 3;
      },
      message: "You can upload a maximum of 3 experience images.",
     },
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },

    rejectionReason: {
      type: String,
      trim: true
    }

  },

  { timestamps: true, versionKey: false }
);

const villaLikeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  villa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Villa",
    required: true,
  }
}, { timestamps: true ,versionKey:false});

villaLikeSchema.index({ user: 1, villa: 1 }, { unique: true });

reviewSchemaOfVilla.index({ user: 1, villa: 1 }, { unique: true });

export const VillaLike = mongoose.model("VillaLike",villaLikeSchema)
export const VillaReview = mongoose.model("Review", reviewSchemaOfVilla);
