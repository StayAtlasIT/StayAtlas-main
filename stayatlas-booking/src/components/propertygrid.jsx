import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PropertyListingGrid({
  priceRange,
  roomCount,
  selectedAmenities,
  preferences,
  nearby,
  houseRules,
  roomType
}) {
  const [liked, setLiked] = useState({});
  const [loadingLike, setLoadingLike] = useState({});
  const [properties, setProperties] = useState([]);
  const [reviewStats, setReviewStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch liked villas from backend
  const fetchLikedVillas = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLiked({}); // No likes if not logged in
      return;
    }
    try {
      const res = await axios.get('/v1/users/liked-villas', { withCredentials: true });
      if (res.data?.success) {
        const likedVillas = res.data.likedVillas || [];
        setLiked((prev) => {
          const newLiked = { ...prev };
          likedVillas.forEach(id => { newLiked[id] = true; });
          return newLiked;
        });
      }
    } catch (err) {
      setLiked({});
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchLikedVillas();
    else setLiked({});
  }, []);

  // NOTE: Viewing explore villas is always public. Only liking/favoriting requires login.
  const handleLike = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to like villas", { autoClose: 3000 });
      return;
    }
    setLoadingLike((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await axios.post(
        `/v1/reviews/like/${id}`,
        {},
        { withCredentials: true }
      );
      if (res.data?.success) {
        await fetchLikedVillas();
        toast.success(
          liked[id] ? "Removed from your likes!" : "Added to your likes!",
          { autoClose: 3000 }
        );
      } else {
        toast.error(res.data?.message || "Something went wrong!", { autoClose: 3000 });
      }
    } catch (err) {
      // Do not show error toast for not-logged-in users
    } finally {
      setLoadingLike((prev) => ({ ...prev, [id]: false }));
    }
  };

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);
        const {
          data: { data },
        } = await axios.get("/v1/villas");
        const filtered = data.filter(
          (property) => property.isExclusive === false
        );
        setProperties(filtered);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching explore data");
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

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

  // --- FILTERING LOGIC (only if filter props are provided) ---
  let filteredProperties = properties;
  if (
    priceRange ||
    roomCount ||
    selectedAmenities ||
    preferences ||
    nearby ||
    houseRules ||
    roomType
  ) {
    filteredProperties = properties.filter((property) => {
      // Price Range
      if (
        priceRange &&
        (property.pricePerNight < priceRange[0] ||
          property.pricePerNight > priceRange[1])
      ) {
        return false;
      }
      // Room Count
      if (roomCount && property.numberOfRooms < roomCount) {
        return false;
      }
      // Amenities
      if (
        selectedAmenities &&
        selectedAmenities.length > 0 &&
        !selectedAmenities.every((amenity) => property.amenities?.includes(amenity))
      ) {
        return false;
      }
      // Preferences
      if (preferences && preferences["Pet Friendly"] && !property.petFriendly) {
        return false;
      }
      if (preferences && preferences["Family Friendly"] && !property.familyFriendly) {
        return false;
      }
      // Nearby
      if (nearby && nearby["Near Railway Station"] && !property.nearRailwayStation) {
        return false;
      }
      if (nearby && nearby["Near Airport"] && !property.nearAirport) {
        return false;
      }
      if (nearby && nearby["Near Scenic View"] && !property.nearScenicView) {
        return false;
      }
      if (nearby && nearby["Near Mandir"] && !property.nearMandir) {
        return false;
      }
      // House Rules
      if (houseRules && houseRules["Smoking friendly"] && !property.smokingFriendly) {
        return false;
      }
      if (houseRules && houseRules["Parties"] && !property.partiesAllowed) {
        return false;
      }
      if (houseRules && houseRules["Pet friendly"] && !property.petFriendly) {
        return false;
      }
      if (houseRules && houseRules["Loud music"] && !property.loudMusicAllowed) {
        return false;
      }
      // Room Type
      if (roomType && roomType !== "any" && property.roomType !== roomType) {
        return false;
      }
      return true;
    });
  }

  if (loading) {
    return (
      <div className="bg-gray-50 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6 max-w-none">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse max-w-md mx-auto w-full"
            >
              <div className="h-48 sm:h-56 bg-gray-200"></div>
              <div className="p-4 sm:p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (filteredProperties.length === 0) {
    return (
      <div className="bg-gray-50 min-h-[400px] flex justify-center items-center">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-4">🏠</div>
          <div className="text-gray-600 text-lg font-medium">
            No Villas Found
          </div>
          <div className="text-gray-500 text-sm mt-2">
            Try adjusting your filters
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6 max-w-none">
        {filteredProperties.map((property) => (
          <div
            key={property._id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 group max-w-md mx-auto w-full"
          >
            <div className="relative h-48 sm:h-56 overflow-hidden">
              <img
                src={property.images?.[0] || "/placeholder-villa.jpg"}
                alt={property.villaName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = "/placeholder-villa.jpg";
                }}
              />

              {property.rating >= 4.5 && (
                <div className="absolute top-3 left-3 bg-black text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                  <span>⭐</span>
                  <span>Best Rated</span>
                </div>
              )}

              <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(property._id);
                  }}
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm hover:bg-opacity-70 transition"
                  aria-label={
                    liked[property._id] ? "Unlike villa" : "Like villa"
                  }
                  disabled={loadingLike[property._id]}
                >
                  <svg
                    className={`w-4 h-4 ${
                      liked[property._id]
                        ? "text-red-500 fill-current"
                        : "text-white"
                    }`}
                    fill={liked[property._id] ? "currentColor" : "none"}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    if (navigator.share) {
                      navigator
                        .share({
                          title: property.villaName,
                          text: `Check out ${property.villaName} at ${property.address?.city}, ${property.address?.state}`,
                          url: window.location.href,
                        })
                        .catch(console.error);
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied to clipboard!", {
                        autoClose: 3000,
                      });
                    }
                  }}
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-opacity-70 transition"
                  aria-label="Share villa"
                >
                  <svg
                    className="w-4 h-4 text-white"
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

              {property.images && property.images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {property.images.slice(0, 5).map((_, index) => (
                    <div
                      key={index}
                      className="w-1.5 h-1.5 rounded-full bg-white/60"
                    ></div>
                  ))}
                  {property.images.length > 5 && (
                    <div className="text-white text-xs bg-black/50 px-1 rounded">
                      +{property.images.length - 5}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 sm:p-5">
              <div className="mb-3">
                <h3 className="font-bold text-lg sm:text-xl line-clamp-1 mb-1 text-gray-900">
                  {property.villaName}
                </h3>
                {/* Rating */}
                {property?._id &&
                  (() => {
                    const stats = getReviewStatsForVilla(property._id);
                    const averageRating = stats?.averageRating ?? 0.0;
                    const reviewCount = stats?.reviewCount ?? 0;

                    return (
                      <a href="#reviews" className="flex mt-1 items-center gap-1 text-yellow-500 text-sm font-medium cursor-pointer hover:underline">
                        <span className="text-base font-semibold text-yellow-500">
                          {averageRating.toFixed(1)}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 text-yellow-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.572-.955L10 0l2.94 5.955 6.572.955-4.756 4.635 1.122 6.545z" />
                        </svg>
                        <span className="text-sm text-gray-500">
                          ({reviewCount}{" "}
                          {reviewCount === 1 ? "review" : "reviews"})
                        </span>
                      </a>
                    );
                  })()}

                <div className="text-sm text-gray-600 flex items-center">
                  <svg
                    className="h-4 w-4 mr-1 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="line-clamp-1">
                    {property.address?.city}, {property.address?.state}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <span>👥</span>
                  <span>Upto {property.guestCapacity || (property.numberOfRooms * 2) || 0} Guests</span>                
                </div>
                <div className="flex items-center gap-1">
                  <span>🏠</span>
                  <span>{property.numberOfRooms || 0} Rooms</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🚿</span>
                  <span>{property.numberOfRooms || 0} Baths</span>
                </div>
              </div>

              {property.suitableFor && (
                <div className="mb-3">
                  <span className="text-sm text-gray-600">Great for: </span>
                  <span className="text-sm font-medium text-gray-800">
                    {property.suitableFor}
                  </span>
                </div>
              )}

              <div className="text-sm text-gray-600 line-clamp-1 mb-4">
                {property.amenities?.join(" • ")}
              </div>

              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="font-bold text-lg sm:text-xl text-gray-900">
                    ₹{property.pricePerNight?.toLocaleString()}
                  </span>
                  <div className="text-xs text-gray-500">
                    Per Night + Taxes (1 room)
                  </div>
                </div>
                <div className="text-right">
                  {/* <div className="flex items-center justify-end mb-1">
                    <svg className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927a1 1 0 011.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-bold text-sm">{property.rating || '4.8'}</span>
                    <span className="text-xs text-gray-500 ml-1">of 5</span>
                  </div> */}
                </div>
              </div>

              <button
                onClick={() => navigate(`/booking/${property._id}`)}
                className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>View</span>
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
