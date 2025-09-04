import React, { useState } from "react";
import ShareModel from "./ShareModel";
import { ArrowLeft, Share2} from "lucide-react"; // Import ChevronLeft icon
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

function VillaHeader({ title, photos, rating, reviewCount, rooms }) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const navigate = useNavigate(); // Initialize the hook

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-4 relative bg-white">
 {/* Mobile Header */}
<div className="md:hidden flex items-center justify-between w-full py-0">
  {/* Left: Arrow + Title */}
  <div className="flex items-center gap-3">
    <button
      onClick={() => navigate(-1)}
      className="p-1 rounded-full hover:bg-gray-100 transition"
      aria-label="Go back"
    >
      <ArrowLeft className="w-6 h-6 text-black" strokeWidth={3} />
    </button>
    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
  </div>

  {/* Right: Share Button */}
  <button
  onClick={() => setIsShareOpen(true)}
  className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
  aria-label="Share"
>
  <Share2 className="w-4 h-4 text-black" strokeWidth={2} />
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