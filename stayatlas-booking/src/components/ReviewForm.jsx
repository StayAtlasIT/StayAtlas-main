import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// ⭐ Star Rating Component
const StarRating = ({ rating, setRating }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={star <= (hovered || rating) ? "#facc15" : "none"}
          stroke={star <= (hovered || rating) ? "#facc15" : "#d1d5db"}
          strokeWidth="1.5"
          className="w-7 h-7 cursor-pointer transition-all"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => setRating(star)}
        >
          <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.572-.955L10 0l2.94 5.955 6.572.955-4.756 4.635 1.122 6.545z" />
        </svg>
      ))}
    </div>
  );
};

const ReviewForm = ({ villaId, onClose }) => {
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("rating", rating);
    formData.append("description", description);
    for (let img of images) formData.append("experienceImages", img);

    try {
      const res = await axios.post(
        `/v1/reviews/rate-comment/${villaId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data?.statusCode === 201 || res.data?.statusCode === 200) {
        toast.success("Review submitted successfully!");
        onClose();
      }
    } catch (err) {
      console.error("Review error:", err);
      toast.error("Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex justify-center items-center px-4">
        <div className="bg-white w-full max-w-lg rounded-xl shadow-xl border border-gray-200 p-6 relative overflow-y-auto max-h-[90vh]">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl font-bold"
          >
            &times;
          </button>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <h3 className="text-2xl font-bold text-gray-800 text-center">
              Leave a Review
            </h3>

            {/* Title Input */}
            <div className="flex flex-col gap-1">
              {/* <label className="text-sm font-medium text-gray-600">
                Review Title
              </label> */}
              <input
                type="text"
                placeholder="Review Title"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Rating Box */}
            <div className="flex justify-center">
              <div className="border border-gray-300 rounded-lg p-4 shadow-sm bg-gray-50 w-full max-w-lg flex flex-col items-center">
                <label className="mb-3 text-sm font-medium text-gray-700 text-center">
                  How easy was it to book the hotel?
                </label>
                <StarRating rating={rating} setRating={setRating} />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              {/* <label className="text-sm font-medium text-gray-600">
                Review Description
              </label> */}
              <textarea
                placeholder="Share your experience..."
                className="w-full p-3 border border-gray-300 rounded-md resize-none h-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Upload Images */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                Upload Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages([...e.target.files])}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4 cursor-pointer
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-3 cursor-pointer rounded-lg font-medium transition ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ReviewForm;
