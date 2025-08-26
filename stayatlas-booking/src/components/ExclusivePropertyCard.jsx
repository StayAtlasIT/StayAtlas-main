import React, { useState, useEffect } from "react";
import {
  FaBed,
  FaBath,
  FaSwimmingPool,
  FaLeaf,
  FaCampground,
  FaFire,
  FaArrowLeft,
  FaArrowRight,
  FaStar,
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function parseDateDMY(dateStr) {
  // Expects dd/mm/yyyy
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split('/');
  return new Date(`${year}-${month}-${day}`);
}

function getNumberOfNights(checkIn, checkOut) {
  const inDate = parseDateDMY(checkIn);
  const outDate = parseDateDMY(checkOut);
  if (!inDate || !outDate || isNaN(inDate) || isNaN(outDate)) return 1;
  const diffTime = outDate - inDate;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
}

function formatCurrency(amount) {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

function ExclusivePropertyCard({ villa, nights = 1, isCompact = false }) {
  // Default values for villa properties
  const safeVilla = {
    id: villa?._id || villa?.id || '',
    name: villa?.villaName || 'Property Name',
    location: `${villa?.address?.city || ''}, ${villa?.address?.state || ''}`,
    rooms: villa?.numberOfRooms || 0,
    price: villa?.pricePerNightBoth?.weekday || 0,
    discountPercent: villa?.discountPercent || 0,
    description: villa?.description || 'No description available',
    image: Array.isArray(villa?.images) ? villa.images : [], // ✅ Return the full array
    amenities: Array.isArray(villa?.amenities) ? villa.amenities : [],
    rating: villa?.averageRating || 0,
    baths: villa?.numberOfBathrooms || 0,
  };


  const [showFullDescription, setShowFullDescription] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [reviewStats, setReviewStats] = useState([]);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Touch/swipe handlers for mobile image slider
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const fetchLikedStatus = async () => {
    if (!isLoggedIn || !safeVilla.id) {
      setLiked(false);
      setIsLoading(false);
      return;
    }
    try {
      const res = await axios.get('/v1/users/liked-villas');
      if (res.data?.success) {
        const likedVillas = res.data?.likedVillas || [];
        setLiked(likedVillas.includes(safeVilla.id));
      } else {
        setLiked(false);
      }
    } catch (err) {
      setLiked(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && safeVilla.id) fetchLikedStatus();
    else setLiked(false);
  }, [safeVilla.id, isLoggedIn]);

  useEffect(() => {
    setIsLoading(false);
  }, []);



  const handleLike = async (e) => {
    // Prevent the parent card's onClick from triggering
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.error("Please login to like villas");
      return;
    }
    if (!safeVilla.id) {
      toast.error("Invalid villa ID");
      return;
    }
    setLoadingLike(true);
    try {
      const res = await axios.post(
        `/v1/reviews/like/${safeVilla.id}`,
        {},
      );
      if (res.data?.success) {
        toast.success(
          liked ? "Removed from your likes!" : "Added to your likes!"
        );
        await fetchLikedStatus();
      } else {
        toast.error(res.data?.message || "Something went wrong!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred. Please try again.");
      console.error("Error toggling like:", err);
    } finally {
      setLoadingLike(false);
    }
  };


  // review
  useEffect(() => {
    const fetchReviewStats = async () => {
      try {
        const res = await axios.get("/v1/reviews/villa-review-stats");
        // console.log("API DATA:", res.data.data);
        setReviewStats(res.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch review stats", error);
        setLoading(false);
      }
    };

    fetchReviewStats();
  }, []);

  const getReviewStatsForVilla = (villaId) => {
    return reviewStats.find((item) => item.villaId === villaId);
  };


  const handleShare = (e) => {
    // Prevent the parent card's onClick from triggering
    e.stopPropagation();

    if (navigator.share) {
      navigator.share({
        title: safeVilla.name,
        text: `Check out ${safeVilla.name} at ${safeVilla.location}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!", { autoClose: 3000 });
    }
  };

  const amenityIcons = {
    pool: { icon: <FaSwimmingPool />, label: "Private Pool" },
    lawn: { icon: <FaLeaf />, label: "Lawn" },
    gazebo: { icon: <FaCampground />, label: "Gazebo" },
    bonfire: { icon: <FaFire />, label: "Bonfire" },
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (safeVilla.image.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? safeVilla.image.length - 1 : prevIndex - 1
      );
    }
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (safeVilla.image.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === safeVilla.image.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (touchStartX !== null && touchEndX !== null) {
      const diff = touchStartX - touchEndX;
      if (diff > 40) handleNextImage(); // swipe left
      else if (diff < -40) handlePrevImage(); // swipe right
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const calculateTotalPrice = () => {
    return safeVilla.price * nights;
  };

  const totalPrice = calculateTotalPrice();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const handleCardClick = () => {
    navigate(`/booking/${safeVilla.id}`);
  };

  return isCompact ? (
    // Compact version for search results
    <div
      className="flex gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Thumbnail */}
      <div className="w-24 h-24 flex-shrink-0">
        <img
          src={safeVilla.image[0]}
          alt={safeVilla.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{safeVilla.name}</h3>
        <p className="text-sm text-gray-500 truncate">{safeVilla.location}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">
            ₹{(safeVilla.price * nights).toLocaleString()}
          </span>
          {nights > 1 && (
            <span className="text-sm text-gray-500">
              for {nights} nights
            </span>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="w-full max-w-md md:max-w-full mx-auto flex flex-col md:flex-row border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 mb-6 bg-white relative min-h-[240px]">
      {/* Rating - Top Right (desktop only) */}
      {safeVilla?.id &&
        (() => {
          const stats = getReviewStatsForVilla(safeVilla.id);
          const averageRating = stats?.averageRating ?? 0.0;
          const reviewCount = stats?.reviewCount ?? 0;

          return (
            <div className="hidden md:flex absolute top-2 md:top-4 right-2 md:right-4 items-center gap-1 bg-white bg-opacity-90 px-2 md:px-3 py-1 rounded-full shadow text-[#002B20] font-semibold text-sm md:text-base z-20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.572-.955L10 0l2.94 5.955 6.572.955-4.756 4.635 1.122 6.545z" />
              </svg>
              <span>{averageRating.toFixed(1)}</span>
              <span className="text-gray-500 text-xs">({reviewCount})</span>
            </div>
          );
        })()}

      {/* Main card content, made clickable */}
      <div
        className="w-full flex flex-col md:flex-row cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Image Container - Full Height Left Side */}
        <div className="relative w-full md:w-2/5 h-48 sm:h-56 md:h-auto rounded-t-lg md:rounded-l-lg md:rounded-tr-none overflow-hidden flex-shrink-0 bg-gray-100 group">
          {/* Like + Share buttons */}
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 flex flex-col gap-2 sm:gap-3">
            <button
              onClick={handleLike}
              disabled={loadingLike}
              className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm hover:bg-opacity-70 transition ${loadingLike ? "opacity-50 cursor-not-allowed" : ""}`}
              aria-label={liked ? "Unlike villa" : "Like villa"}
            >
              <svg
                className={`w-4 h-4 ${liked ? "text-red-500 fill-current" : "text-white"}`}
                fill={liked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
            <button
              onClick={handleShare}
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-opacity-70 transition"
              aria-label="Share villa"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          </div>

          {/* Image Slider */}
          <div
            className="w-full h-full flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {safeVilla.image.length > 0 ? (
              safeVilla.image.map((img, index) => (
                <div key={index} className="relative w-full h-full flex-shrink-0">
                  <img
                    src={img}
                    alt={`${safeVilla.name} - Image ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    style={{
                      aspectRatio: '16/9',
                      maxHeight: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80';
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="relative w-full h-full flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
                  alt="Default property image"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  style={{
                    aspectRatio: '16/9',
                    maxHeight: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                />
              </div>
            )}
          </div>

          {/* Carousel Dots - Always show exactly 3 dots */}
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
            {/* Always show exactly 3 dots regardless of how many images */}
            {[0, 1, 2].map((dotIndex) => {
              // Calculate which dot should be active based on current image index
              const totalImages = Math.max(safeVilla.image.length, 1);
              let isActive = false;
              
              if (totalImages <= 1) {
                // If there's only one image, highlight the first dot
                isActive = dotIndex === 0;
              } else if (totalImages === 2) {
                // If there are two images, highlight first or second dot
                isActive = dotIndex === currentImageIndex && dotIndex < 2;
              } else {
                // For 3+ images
                isActive = 
                  (dotIndex === 0 && currentImageIndex === 0) || 
                  (dotIndex === 1 && currentImageIndex > 0 && currentImageIndex < totalImages - 1) || 
                  (dotIndex === 2 && currentImageIndex === totalImages - 1);
              }
              
              return (
                <span
                  key={dotIndex}
                  className={`block w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-200 ${
                    isActive ? "bg-white border border-[#002B20] scale-125" : "bg-gray-300"
                  }`}
                  style={{ boxShadow: isActive ? "0 0 4px #002B20" : "none" }}
                />
              );
            })}
          </div>

          {/* Prev / Next Buttons */}
          {safeVilla.image.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-1.5 sm:p-2 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-label="Previous image"
              >
                <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-1.5 sm:p-2 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-label="Next image"
              >
                <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {safeVilla.image.length > 0 && (
            <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 bg-black bg-opacity-60 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded z-10">
              {`${currentImageIndex + 1}/${safeVilla.image.length}`}
            </div>
          )}
        </div>

        {/* Right: Content */}
        <div className="flex-1 md:w-3/5 p-3 sm:p-4 md:p-6 flex flex-col justify-between min-h-full">
          <div>
            {/* Name & Location */}
            <p className="text-base sm:text-lg md:text-2xl font-bold text-[#002B20] mb-1">{safeVilla.name}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                safeVilla.name + " " + safeVilla.location
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 text-xs md:text-sm hover:underline mb-2 sm:mb-3 md:mb-4 inline-block"
              onClick={(e) => e.stopPropagation()} // Prevent card click
            >
              {safeVilla.location}
            </a>
            {/* Rooms and Guests */}
            <div className="text-xs md:text-sm text-gray-700 flex gap-2 sm:gap-3 md:gap-6 flex-wrap mb-2 sm:mb-3">
              <span>Upto {safeVilla.rooms * 2} Guests</span>
              <span>
                <FaBed className="inline mr-1" /> {safeVilla.rooms} Rooms
              </span>
              <span>
                <FaBath className="inline mr-1" /> {safeVilla.baths} Baths
              </span>
            </div>
            {/* Amenities */}
            {safeVilla.amenities?.length > 0 && (
              <div className="flex gap-1.5 sm:gap-2 md:gap-4 mt-2 sm:mt-3 md:mt-4 text-gray-700 text-xs md:text-sm flex-wrap border-t pt-2 sm:pt-3 md:pt-4">
                {safeVilla.amenities.map((amenity, index) =>
                  amenityIcons[amenity] ? (
                    <span key={index} className="flex items-center gap-1">
                      {amenityIcons[amenity].icon}
                      {amenityIcons[amenity].label}
                    </span>
                  ) : (
                    <span key={index} className="flex items-center gap-1">
                      • {amenity}
                    </span>
                  )
                )}
              </div>
            )}
            {/* Description */}
            <p className="text-xs md:text-sm mt-2 sm:mt-3 md:mt-4 text-gray-500">
              {showFullDescription
                ? safeVilla.description
                : safeVilla.description.slice(0, 100) + "... "}
              {safeVilla.description.length > 100 && (
                <span
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    setShowFullDescription(!showFullDescription);
                  }}
                  className="text-blue-500 cursor-pointer ml-1"
                >
                  {showFullDescription ? "Read less" : "Read more"}
                </span>
              )}
            </p>
          </div>
          {/* Price & View Button */}
          {/* Mobile: Price + Rating in one row */}
          <div className="flex md:hidden flex-row items-center justify-between mt-3 sm:mt-4 gap-2">
            <div>
              <p className="text-base sm:text-lg font-bold text-[#002B20]">
                {formatCurrency(totalPrice)}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500">
                {formatCurrency(safeVilla.price)} per night
              </p>
            </div>
            <div className="flex items-center gap-1 bg-white bg-opacity-90 px-2 sm:px-3 py-1 rounded-full shadow text-[#002B20] font-semibold text-sm sm:text-base">
              <FaStar className="text-yellow-400" />
              <span>{safeVilla.rating.toFixed(1)}</span>
            </div>
          </div>
          {/* Desktop: Price and View button in one row */}
          <div className="hidden md:flex mt-4 md:mt-6 flex-row justify-between items-center gap-3 md:gap-4">
            <div>
              <p className="text-xl md:text-2xl font-bold text-[#002B20]">
                {formatCurrency(totalPrice)}
              </p>
              <p className="text-xs md:text-sm text-gray-500">
                {formatCurrency(safeVilla.price)} per night
              </p>
            </div>
            {/* The View button is no longer needed since the entire card is clickable */}
            <button
              className="w-auto bg-black text-white px-4 md:px-6 py-2 rounded font-semibold hover:bg-[#002B20] transition-colors duration-200"
              onClick={(e) => {
                e.stopPropagation(); // Stop click from propagating up to the card
                navigate(`/booking/${safeVilla.id}`);
              }}
            >
              View →
            </button>
          </div>
          {/* View Button (mobile only, full width) */}
          <button
            className="block md:hidden w-full bg-black text-white px-4 py-2 rounded font-semibold hover:bg-[#002B20] transition-colors duration-200 mt-3"
            onClick={(e) => {
              e.stopPropagation(); // Stop click from propagating up to the card
              navigate(`/booking/${safeVilla.id}`);
            }}
          >
            View →
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExclusivePropertyCard;