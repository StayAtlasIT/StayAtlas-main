import React from "react";
import ShareOptions from "./ShareOptions";
import { FaHouse } from "react-icons/fa6";

function ShareModel({
  isOpen,
  onClose,
  villaImage,
  villaName,
  averageRating,
  reviewCount,
  rooms,
}) {
  if (!isOpen) return null;

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      onClick={handleOutsideClick}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Share this place
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Villa Info */}
        <div className="p-4 bg-gray-50">
          <div className="flex gap-3">
            <img
              src={villaImage}
              alt="Villa Preview"
              className="w-16 h-16 rounded-md object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-800">
                {villaName} by StayAtlas
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-yellow-500">
                  {averageRating.toFixed(1)}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 fill-current text-yellow-500"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.572-.955L10 0l2.94 5.955 6.572.955-4.756 4.635 1.122 6.545z" />
                </svg>
                <span className="text-gray-500 font-normal">
                  ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                </span>
              </div>

              <div className="flex items-center gap-1 text-black font-medium">
                <FaHouse className="text-black mr-1" />
                {rooms ?? "-"} BHK
              </div>
            </div>
          </div>
        </div>

        {/* Share Options */}
        <ShareOptions onClose={onClose} />
      </div>
    </div>
  );
}

export default ShareModel;
