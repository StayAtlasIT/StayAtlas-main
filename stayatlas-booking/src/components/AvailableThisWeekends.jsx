import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  FaSnowflake, FaCar, FaFire, FaSink, FaCouch, FaUtensils, FaTv,
  FaChair, FaWifi, FaSeedling, FaHouse, FaPersonWalkingLuggage
} from "react-icons/fa6";
import { Star, ChevronLeft, ChevronRight, DoorClosed } from "lucide-react";

// Amenity icons mapping
const amenityIcons = {
  "Air Conditioner": <FaSnowflake className="text-black text-xs" />,
  "Private Parking": <FaCar className="text-black text-xs" />,
  "Barbeque (Chargeable)": <FaFire className="text-black text-xs" />,
  "Microwave": <FaSink className="text-black text-xs" />,
  "Sofa": <FaCouch className="text-black text-xs" />,
  "Dining Table": <FaUtensils className="text-black text-xs" />,
  "Flat Screen Tv": <FaTv className="text-black text-xs" />,
  "Outdoor Furniture": <FaChair className="text-black text-xs" />,
  "WiFi": <FaWifi className="text-black text-xs" />,
  "Garden": <FaSeedling className="text-black text-xs" />,
};

const Card = ({ villa }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = villa.images || [];

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden w-[320px] sm:w-[350px] md:w-[370px] lg:w-[390px] flex-shrink-0 cursor-pointer hover:shadow-lg transition-transform duration-300 hover:-translate-y-1"
      onClick={() => (window.location.href = `/booking/${villa._id}`)}
    >
      {/* Image Slider */}
      <div className="relative group h-52 md:h-56">
        {images.length > 0 && (
          <img
            src={images[currentImage]}
            alt={villa.villaName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Arrows for images */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
              onClick={prevImage}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
              onClick={nextImage}
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Badge */}
        {villa.isExclusive && (
          <div
            className="absolute top-3 left-0 bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-400 
               text-gray-900 px-4 py-1 font-semibold text-xs 
               shadow-lg border border-yellow-500/50 tracking-wide"
            style={{
              fontFamily: "'Playfair Display', serif",
              letterSpacing: "0.5px",
              clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)",
            }}
          >
            EXCLUSIVE
          </div>
        )}

        {/* Rating */}
        <div className="absolute bottom-2 left-2 flex items-center bg-white/90 px-2 py-0.5 rounded-full text-xs font-semibold text-gray-800 shadow-sm">
          <Star size={12} className="text-yellow-400 fill-current mr-1" />
          <span>{villa.averageRating?.toFixed(1) || "N/A"} ({villa.reviewsCount || 0})</span>
        </div>
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="text-base md:text-lg font-bold text-gray-800 truncate">
          {villa.villaName}
        </h3>
        <p className="text-xs md:text-sm text-gray-500 mb-2">
          {villa.address?.city}, {villa.address?.state}
        </p>

        {/* Property Info */}
        <div className="flex flex-wrap gap-2 mb-3 text-xs md:text-sm">
          <div className="flex items-center gap-1 border px-2 py-0.5 rounded-full bg-gray-50">
            <FaHouse /> {villa.numberOfRooms} BHK
          </div>
          <div className="flex items-center gap-1 border px-2 py-0.5 rounded-full bg-gray-50">
            <FaPersonWalkingLuggage /> {villa.guestCapacity || (villa.numberOfRooms * 2)} Guests
          </div>
          <div className="flex items-center gap-1 border px-2 py-0.5 rounded-full bg-gray-50">
          <DoorClosed size={14} /> {villa.numberOfBathrooms || 0} Bathrooms
          </div>
        </div>

        {/* Amenities */}
        {villa.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {villa.amenities.slice(0, 4).map((amenity, idx) => (
              <div
                key={idx}
                className="flex items-center bg-gray-100 text-gray-600 text-[11px] px-2 py-0.5 rounded-full"
              >
                {amenityIcons[amenity] || null}
                <span className="ml-1 truncate">{amenity}</span>
              </div>
            ))}
            {villa.amenities.length > 4 && (
              <div
                className="flex items-center bg-blue-100 text-blue-600 text-[11px] px-2 py-0.5 rounded-full cursor-pointer hover:bg-blue-200"
                onClick={(e) => {
                  e.stopPropagation();
                  // Redirect to the booking page
                  window.location.href = `/booking/${villa._id}`;
                }}
              >
                +More
              </div>
            )}
          </div>
        )}

        {/* Price & Button */}
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-gray-800">
            ₹{villa.pricePerNight || 0}
            <span className="text-xs font-normal text-gray-500 ml-1">/ night</span>
          </p>
          <button
            className="bg-gradient-to-r from-blue-700 to-blue-900 text-white font-bold py-1.5 px-4 rounded-full text-xs md:text-sm hover:shadow-lg transition"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `/booking/${villa._id}`;
            }}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

const AvailableThisWeekends = () => {
  const [villas, setVillas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const API_ENDPOINT = `${BACKEND_URL}/v1/villas/available-weekend`;

    axios
      .get(API_ENDPOINT)
      .then((res) => {
        const { normalVilla, exclusiveVillas } = res.data || {};
        const normalVillaArray = Array.isArray(normalVilla)
          ? normalVilla
          : normalVilla
          ? [normalVilla]
          : [];
        const orderedVillas = [
          ...(exclusiveVillas || []),
          ...normalVillaArray,
        ];
        setVillas(orderedVillas);
      })
      .catch((err) => {
        console.error("Error fetching villas:", err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  return (
    <div className="py-10 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 relative">
        <h2
          className="font-bold text-gray-800 mb-6 flex justify-between items-center whitespace-nowrap"
          style={{
            fontSize: "20px",       // mobile
          }}
        >
          <span className="block md:hidden">Available This Weekend</span>
          <span
            className="hidden md:block"
            style={{
              fontSize: "28px",     // desktop & tablet
            }}
          >
            Available This Weekend
          </span>

          {/* Top right arrows */}
          <div className="flex gap-3 ml-4">
            <button
              onClick={scrollLeft}
              className="w-10 h-10 flex items-center justify-center rounded-full shadow-md bg-white hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={scrollRight}
              className="w-10 h-10 flex items-center justify-center rounded-full shadow-md bg-white hover:bg-gray-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </h2>


        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sky-500"></div>
          </div>
        ) : villas.length > 0 ? (
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
          >
            {villas.map((villa) => (
              <Card key={villa._id} villa={villa} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            No villas available this weekend.
          </p>
        )}
      </div>
    </div>
  );
};

export default AvailableThisWeekends;