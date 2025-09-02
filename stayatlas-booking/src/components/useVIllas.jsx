import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux"; // <- Added

function parseDateDMY(dateStr) {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split("/");
  return new Date(`${year}-${month}-${day}`);
}

function UseExclusive({ villa, nights = 1 }) {
  const navigate = useNavigate();
  const { isLoggedIn, token } = useSelector((state) => state.auth); // <- Redux state

  const safeVilla = {
    id: villa?._id || villa?.id || "",
    name: villa?.villaName || "Property Name",
    location: `${villa?.address?.city || ""}, ${villa?.address?.state || ""}`,
    rooms: villa?.numberOfRooms || 0,
    baths: villa?.numberOfBathrooms || 0,
    price: villa?.pricePerNightBoth?.weekday || 0,
    discountPercent: villa?.discountPercent || 0,
    description: villa?.description || "No description available",
    image: Array.isArray(villa?.images) ? villa.images : [],
    amenities: Array.isArray(villa?.amenities) ? villa.amenities : [],
    rating: villa?.averageRating || 0,
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [reviewStats, setReviewStats] = useState([]);

  // Fetch liked status for the villa
  const fetchLikedStatus = async () => {
    if (!isLoggedIn || !safeVilla.id) {
      setLiked(false);
      return;
    }

    try {
      const res = await axios.get("/v1/users/liked-villas", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) {
        const likedVillas = res.data?.likedVillas || [];
        setLiked(likedVillas.includes(safeVilla.id));
      } else {
        setLiked(false);
      }
    } catch (err) {
      console.error("Error fetching liked status:", err);
      setLiked(false);
    }
  };

  useEffect(() => {
    fetchLikedStatus();
  }, [safeVilla.id, isLoggedIn, token]);

  // Handle like/unlike villa
  const handleLike = async (e) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.error("Please login to like villas", { autoClose: 3000 });
      return;
    }

    if (!safeVilla.id) {
      toast.error("Invalid villa ID", { autoClose: 3000 });
      return;
    }

    setLoadingLike(true);

    try {
      const res = await axios.post(
        `/v1/reviews/like/${safeVilla.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.success) {
        toast.success(
          liked ? "Removed from your likes!" : "Added to your likes!",
          { autoClose: 3000 }
        );
        await fetchLikedStatus();
      } else {
        toast.error(res.data?.message || "Something went wrong!", {
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error("Like/unlike error:", err);
      toast.error("Failed to update like status", { autoClose: 3000 });
    } finally {
      setLoadingLike(false);
    }
  };

  // Fetch review stats
  useEffect(() => {
    const fetchReviewStats = async () => {
      try {
        const res = await axios.get("/v1/reviews/villa-review-stats");
        setReviewStats(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch review stats", error);
      }
    };
    fetchReviewStats();
  }, []);

  const getReviewStatsForVilla = (villaId) =>
    reviewStats.find((item) => item.villaId === villaId);

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator
        .share({
          title: safeVilla.name,
          text: `Check out ${safeVilla.name} at ${safeVilla.location}`,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!", { autoClose: 3000 });
    }
  };

  // Image carousel
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

  const calculateTotalPrice = () => safeVilla.price * nights;
  const totalPrice = calculateTotalPrice();

  const handleNavigation = () => {
    navigate(`/booking/${safeVilla.id}`);
    window.scrollTo(0, 0);
  };

  const amenityIcons = {
    pool: { icon: <FaSwimmingPool />, label: "Pool" },
    lawn: { icon: <FaLeaf />, label: "Lawn" },
    gazebo: { icon: <FaCampground />, label: "Gazebo" },
    bonfire: { icon: <FaFire />, label: "Bonfire" },
  };

  const stats = getReviewStatsForVilla(safeVilla.id);
  const averageRating = stats?.averageRating ?? 0.0;

  return (
    <div
      onClick={handleNavigation}
      className="w-[320px] min-w-[320px] h-[400px] flex flex-col border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white relative cursor-pointer"
    >
      {/* Rating Badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1 bg-white bg-opacity-90 px-2 py-1 rounded-full shadow text-[#002B20] font-semibold text-sm z-20">
        <FaStar className="text-yellow-400" />
        <span>{averageRating.toFixed(1)}</span>
      </div>

      {/* Image Section */}
      <div className="relative w-full h-48 rounded-t-xl overflow-hidden flex-shrink-0 bg-gray-100 group">
        {safeVilla.image.length > 0 && (
          <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full z-20 hidden group-hover:block">
            {currentImageIndex + 1} / {safeVilla.image.length}
          </div>
        )}

        {/* Like & Share */}
        <div className="absolute top-3 left-3 z-10 flex gap-2">
          <button
            onClick={handleLike}
            disabled={loadingLike}
            className={`w-8 h-8 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm hover:bg-opacity-70 transition ${
              loadingLike ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <svg
              className={`w-4 h-4 ${
                liked ? "text-red-500 fill-current" : "text-white"
              }`}
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
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-opacity-70 transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
          </button>
        </div>

        {/* Image Carousel */}
        <div
          className="w-full h-full flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {safeVilla.image.length > 0 ? (
            safeVilla.image.map((img, index) => (
              <div key={index} className="w-full h-full flex-shrink-0 relative">
                <img
                  src={img}
                  alt={`${safeVilla.name} - Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914";
                  }}
                />
              </div>                      
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
                alt="Default property"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {safeVilla.image.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full z-10 opacity-0 group-hover:opacity-100"
            >
              <FaArrowLeft size={14} />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full z-10 opacity-0 group-hover:opacity-100"
            >
              <FaArrowRight size={14} />
            </button>
          </>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <p className="text-base font-bold text-[#002B20] mb-1 line-clamp-1">
            {safeVilla.name}
          </p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              safeVilla.name + " " + safeVilla.location
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 text-sm hover:underline mb-2 block line-clamp-1"
          >
            {safeVilla.location}
          </a>

          <div className="text-sm text-gray-700 flex items-center justify-between mb-3">
            <span>Upto {safeVilla?.guestCapacity || (safeVilla.rooms * 2)} Guests</span>
            <div className="flex gap-3">
              <span className="flex items-center gap-1">
                <FaBed size={14} /> {safeVilla.rooms}
              </span>
              <span className="flex items-center gap-1">
                <FaBath size={14} /> {safeVilla.baths}
              </span>
            </div>
          </div>

          {safeVilla.amenities?.length > 0 && (
            <div className="flex gap-3 text-gray-700 text-sm border-t pt-2 mb-3">
              {safeVilla.amenities.slice(0, 2).map((amenity, index) => (
                <span key={index} className="flex items-center gap-1">
                  {amenityIcons[amenity] ? (
                    <>
                      {React.cloneElement(amenityIcons[amenity].icon, { size: 14 })}
                      {amenityIcons[amenity].label}
                    </>
                  ) : (
                    <>• {amenity}</>
                  )}
                </span>
              ))}
              {safeVilla.amenities.length > 2 && (
                <span className="text-gray-500">
                  +{safeVilla.amenities.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-auto flex justify-between items-center border-t pt-3">
          <p className="text-xl font-bold text-[#002B20]">
            ₹{totalPrice.toLocaleString()}
            <span className="text-sm font-normal text-gray-500 ml-1">/night</span>
          </p>
          <div className="bg-gradient-to-r from-black to-gray-800 text-white font-semibold py-2 px-4 rounded-xl shadow text-sm">
            Book Now
          </div>
        </div>
      </div>
    </div>
  );
}

export default UseExclusive;
