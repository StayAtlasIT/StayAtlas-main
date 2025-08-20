import React, { useRef, useState, useEffect } from "react";
import axios from 'axios';
import {
  FaHouse,
  FaPersonWalkingLuggage,
} from "react-icons/fa6";
import {
  FaSink,
  FaFire,
  FaCouch,
  FaUtensils,
  FaTv,
  FaDoorClosed,
  FaSnowflake,
  FaChair,
  FaWifi,
  FaSeedling,
  FaCar,
  FaShareAlt,
} from "react-icons/fa";
import { ChevronLeft, ChevronRight, DotSquareIcon, Star } from "lucide-react";

// Assuming these components are defined in separate files and imported
// import ShowReview from './ShowReview';
// import ReviewForm from './ReviewForm';

// Amenity icons to be reused from the main villa page
const amenityIcons = {
  "Air Conditioner": <FaSnowflake className="text-black text-xl" />,
  "Private Parking": <FaCar className="text-black text-xl" />,
  "Barbeque (Chargeable)": <FaFire className="text-black text-xl" />,
  Microwave: <FaSink className="text-black text-xl" />,
  Sofa: <FaCouch className="text-black text-xl" />,
  "Dining Table": <FaUtensils className="text-black text-xl" />,
  "Flat Screen Tv": <FaTv className="text-black text-xl" />,
  Wardrobe: <FaDoorClosed className="text-black text-xl" />,
  Refrigerator: <FaSnowflake className="text-black text-xl" />,
  "Outdoor Furniture": <FaChair className="text-black text-xl" />,
  WiFi: <FaWifi className="text-black text-xl" />,
  Garden: <FaSeedling className="text-black text-xl" />,
  "Washing Machine": <FaSink className="text-black text-xl" />,
  "Swimming Pool": <FaHouse className="text-black text-xl" />,
  Fan: <FaPersonWalkingLuggage className="text-black text-xl" />,
  "Clothes Rack": <FaDoorClosed className="text-black text-xl" />,
};

const PaymentVillaDetails = ({ bookingData, villaDetails }) => {
  const scrollRef = useRef(null);
  const [allReviews, setAllReviews] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const [data, setData] = useState({ villa: villaDetails });
  
  // Placeholder function for fetching reviews.
  const fetchReview = () => {
    // Implement your review fetching logic here.
  };
  
  useEffect(() => {
    if (villaDetails) {
      fetchReview();
    }
  }, [villaDetails]);
  
  if (!villaDetails || !bookingData) {
    return <div>Loading villa details...</div>;
  }

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -250, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 250, behavior: "smooth" });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div>
      {/* Image Gallery */}
      <div className="relative mb-6">
        {villaDetails?.images?.length > 0 && (
          <div
            ref={scrollRef}
            // Decreased the gap from 'gap-4' to 'gap-2'
            className="flex overflow-x-auto gap-2 scrollbar-hide"
          >
            {villaDetails.images.map((imgUrl, index) => (
              <img
                key={index}
                src={imgUrl}
                alt={`Villa image ${index + 1}`}
                className="w-[280px] h-44 object-cover rounded-xl flex-shrink-0 shadow-md"
              />
            ))}
          </div>
        )}
        {/* Navigation Buttons */}
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/70 hover:bg-white transition-colors shadow-md z-10"
          aria-label="Previous image"
        >
          <ChevronLeft className="text-gray-800" />
        </button>
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/70 hover:bg-white transition-colors shadow-md z-10"
          aria-label="Next image"
        >
          <ChevronRight className="text-gray-800" />
        </button>
      </div>

      {/* Villa Info and Booking Details */}
      <div className="mt-4 mb-6">
        <h3 className="text-2xl font-bold text-gray-900">
          {villaDetails.villaName}
        </h3>
        <p className="text-lg text-gray-600 mb-2">
          {villaDetails?.address?.city}, {villaDetails?.address?.country}
        </p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          <div className="flex items-center space-x-1">
            <FaHouse />
            <span>{villaDetails.numberOfRooms} Rooms</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaPersonWalkingLuggage />
            <span>{bookingData.adults + bookingData.children} Guests</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star />
            <span>{villaDetails.averageRating?.toFixed(1) || '0.0'}</span>
          </div>
        </div>

        {/* Booking Dates */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm font-semibold text-gray-800">
          <span>Check-in: <span className="text-gray-600 font-normal">{new Date(bookingData.checkIn).toLocaleDateString()}</span></span>
          <span>Check-out: <span className="text-gray-600 font-normal">{new Date(bookingData.checkOut).toLocaleDateString()}</span></span>
          <span>Nights: <span className="text-gray-600 font-normal">{bookingData.nights}</span></span>
        </div>
      </div>

      {/* Amenities */}
      <div className="mt-6 border-t pt-4 mb-6">
        {villaDetails?.amenities?.length > 0 && (
          <>
            <h4 className="text-lg font-bold text-gray-800 mb-2">Amenities</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {villaDetails.amenities.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-2 text-gray-700 font-medium"
                >
                  <div className="text-lg">
                    {amenityIcons[item] || <DotSquareIcon className="text-black" />}
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Rules and Refund Policy */}
      <div className="mt-8 py-4 mb-6">
        <h2 className="text-2xl font-bold mb-6 border-l-4 border-orange-500 pl-4">Rules and Refund Policy</h2>

        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-start md:justify-between py-4 gap-4">
          {/* 100% Refund - Left */}
          <div className="w-full md:w-1/3 flex flex-col items-start text-left px-2">
            <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              ✓
            </div>
            <p className="font-semibold text-xs mt-2 leading-tight">
              100% Future Stay Voucher /<br />100% Refund
            </p>
            <p className="text-[11px] text-gray-600 mt-1">Before 12 days</p>
          </div>

          {/* Horizontal Dotted Line (Only visible on md and above) */}
          <div className="hidden md:block w-[1px] h-10 border-l border-dashed border-gray-400"></div>

          {/* 50% Refund - Center */}
          <div className="w-full md:w-1/3 flex flex-col items-start text-left px-2">
            <div className="w-6 h-6 bg-yellow-400 text-white rounded-full flex items-center justify-center text-sm font-bold">
              –
            </div>
            <p className="font-semibold text-xs mt-2 leading-tight">
              50% Future Stay Voucher /<br />Refund
            </p>
            <p className="text-[11px] text-gray-600 mt-1">6 to 12 days</p>
          </div>

          {/* Horizontal Dotted Line (Only visible on md and above) */}
          <div className="hidden md:block w-[1px] h-10 border-l border-dashed border-gray-400"></div>

          {/* No Refund - Right */}
          <div className="w-full md:w-1/3 flex flex-col items-start text-left px-2">
            <div className="w-6 h-6 bg-rose-400 text-white rounded-full flex items-center justify-center text-sm font-bold">
              ✕
            </div>
            <p className="font-semibold text-xs mt-3 leading-tight">No Refund</p>
            <p className="text-[11px] text-gray-600 mt-1">Less than 6 days</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 mt-6 sm:flex-row flex-col">
  <a href="/Refund & Cancellation Policy.pdf" target="_blank" rel="noopener noreferrer">
    <button className="w-full sm:w-auto px-4 py-2 rounded-md bg-gray-100 text-gray-800 shadow-sm hover:bg-gray-200 transition">
      Refund Policy
    </button>
  </a>

  <a href="/StayAtlas T&C Policy.pdf" target="_blank" rel="noopener noreferrer">
    <button className="w-full sm:w-auto px-4 py-2 rounded-md bg-gray-100 text-gray-800 shadow-sm hover:bg-gray-200 transition">
      Home Rules and Policy
    </button>
  </a>
</div>

        {/* Check-in note */}
        <div className="mt-8 text-sm text-gray-700">
          Check-in time: <span className="font-bold">1PM</span> , Check-out time: <span className="font-bold">11AM</span><br />
          <span className="text-xs text-gray-500">
            <strong>Note:</strong> Early check-in and late check-out is subject to availability (at an additional fee)
          </span>
        </div>
      </div>
      
      {/* Questions Section */}
      <div className="mt-12 p-6 bg-blue-50 border-b-2 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6">
        <div>
          <h3 className="text-xl font-bold mb-1 text-gray-800">Questions?</h3>
          <p className="text-gray-600">
            Our team is here to help you. Drop us a message!
          </p>
        </div>
        <a
          href="https://wa.me/918591131447"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2 border border-black rounded-full hover:bg-black hover:text-white transition whitespace-nowrap text-center"
        >
          Contact us
        </a>
      </div>

      {/* Guest Reviews Section */}
      {allReviews.length > 0 && (
      <div id="reviews" className="mt-12">
        <h2 className="text-2xl font-bold mb-4 border-l-4 border-orange-500 pl-4 text-gray-800">
          Guest Reviews
        </h2>

        
          <ShowReview reviews={allReviews} />
        

        <hr className="my-8 border-gray-300" />

        {showReview && (
          <ReviewForm
            villaId={data?.villa?._id}
            onClose={() => setShowReview(false)}
            onReviewSubmitted={async () => {
              const res = await axios.get(`/v1/villas/${id}`);
              setData({ villa: res.data.data });
              fetchReview();
            }}
          />
        )}
      </div>
)}

    </div>
  );
};

export default PaymentVillaDetails;