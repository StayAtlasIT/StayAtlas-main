import React, { useState } from "react";
import ShareModel from "./ShareModel";
import { ChevronLeft } from "lucide-react"; // Import ChevronLeft icon
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

function VillaHeader({ title, photos, rating, reviewCount, rooms }) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const navigate = useNavigate(); // Initialize the hook

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-6 relative bg-white">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Back Button for Mobile */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Title */}
        <h1 className="text-gray-900 text-2xl sm:text-3xl font-bold font-montserrat flex-1 min-w-0 truncate">
          {title}
        </h1>

        {/* Share Button */}
        <button
          onClick={() => setIsShareOpen(true)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-full flex items-center font-montserrat whitespace-nowrap"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 mr-2 flex-shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
            />
          </svg>
          Share
        </button>
      </div>

      {isShareOpen && (
        <ShareModel
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          villaImage={photos?.[0]}
          villaName={title}
          averageRating={rating}
          reviewCount={reviewCount}
          rooms={rooms}
        />
      )}
    </div>
  );
}

export default VillaHeader;