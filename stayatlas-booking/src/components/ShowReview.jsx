import React, { useState } from "react";
import { format } from "date-fns";

const ShowReview = ({ reviews }) => {
  const approvedReviews = reviews?.filter((r) => r?.status === "approved") || [];
  const [visibleCount, setVisibleCount] = useState(10); // start with 10 reviews

  if (approvedReviews.length === 0) {
    return <p className="text-gray-500 text-sm mt-4">No reviews yet.</p>;
  }

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, approvedReviews.length));
  };

  const handleShowLess = () => {
    setVisibleCount(10);
  };

  const visibleReviews = approvedReviews.slice(0, visibleCount);

  return (
    <div className="mt-6">
      {visibleReviews.map((review, index) => (
        <div key={review._id}>
          <ReviewCard review={review} />
          {index !== visibleReviews.length - 1 && (
            <hr className="my-6 border-gray-300" />
          )}
        </div>
      ))}

      {/* Show More / Show Less */}
      <div className="mt-4 text-sm font-medium text-blue-600">
        {visibleCount < approvedReviews.length && (
          <button onClick={handleShowMore} className="hover:underline">
            Show more
          </button>
        )}
        {visibleCount > 10 && (
          <>
            {" "}|{" "}
            <button onClick={handleShowLess} className="hover:underline">
              Show less
            </button>
          </>
        )}
      </div>
    </div>
  );
};


const ReviewCard = ({ review }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const {
    title,
    description,
    rating,
    experienceImages = [],
    user,
    createdAt,
  } = review;

  const userInitials = `${user?.firstName?.[0] || ""}${
    user?.lastName?.[0] || ""
  }`.toUpperCase();

  const openImageModal = (index) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  return (
    <div className="flex items-start gap-4 flex-wrap break-words">
      {/* Avatar */}
      <div className="flex-shrink-0 w-10 h-10 bg-red-700 text-white rounded-full flex items-center justify-center font-bold text-sm">
        {userInitials}
      </div>

      {/* Review content */}
      <div className="flex-1 min-w-0">
        {/* Name & Date */}
        <div className="mb-1">
          <h3 className="text-sm font-semibold text-gray-900">
            {user?.firstName && user?.lastName
              ? user.firstName.charAt(0).toUpperCase() +
                user.firstName.slice(1).toLowerCase() +
                " " +
                user.lastName.charAt(0).toUpperCase() +
                user.lastName.slice(1).toLowerCase()
              : "Guest"}
          </h3>

          <p className="text-xs text-gray-500">
            {format(new Date(createdAt), "dd MMMM yyyy")}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 text-yellow-500 text-sm font-medium mb-1">
          <span className="text-base font-semibold">{rating.toFixed(1)}</span>
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 ${
                i < Math.round(rating) ? "fill-current" : "fill-gray-300"
              }`}
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.572-.955L10 0l2.94 5.955 6.572.955-4.756 4.635 1.122 6.545z" />
            </svg>
          ))}
        </div>

        {/* Title and Description */}
        <p className="text-sm font-medium text-gray-800">{title}</p>
        <p className="text-sm text-gray-600 whitespace-pre-wrap break-words overflow-hidden text-ellipsis">
          {description.slice(0, 1000)}
          {description.length > 1000 && "…"}
        </p>

        {/* Thumbnails */}
        {experienceImages.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {experienceImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`thumb-${index}`}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded cursor-pointer"
                onClick={() => openImageModal(index)}
              />
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedImageIndex !== null && (
  <div className="fixed top-0 left-0 w-full h-full z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="relative bg-white rounded-lg p-4 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <button
        className="absolute top-2 right-2 text-red-600 font-bold text-3xl sm:text-4xl"
        onClick={closeModal}
      >
        &times;
      </button>

      <img
        src={experienceImages[selectedImageIndex]}
        alt={`full-${selectedImageIndex}`}
        className="w-full max-h-[80vh] object-contain rounded mb-4"
      />

      <div className="flex flex-wrap gap-3 justify-center">
        {experienceImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`modal-${index}`}
            className={`w-24 h-24 object-cover rounded cursor-pointer transition-all duration-200 ${
              index === selectedImageIndex
                ? "ring-4 ring-blue-400 scale-105"
                : ""
            }`}
            onClick={() => setSelectedImageIndex(index)}
          />
        ))}
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default ShowReview;
