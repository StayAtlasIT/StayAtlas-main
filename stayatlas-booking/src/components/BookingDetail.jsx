import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";
import toast from "react-hot-toast";
import Gallery from "./Gallery";
import ReviewForm from "./ReviewForm";
import ShowReview from "./ShowReview";
import CancelBookingModal from "./CancelBookingModal";
import {
  FaHouse,
  FaPersonWalkingLuggage,
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
} from "react-icons/fa6";
import { Loader, DotSquareIcon, Mail, Phone, LocateIcon } from "lucide-react";

// Amenity icons mapping
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

const BookingDetail = () => {
  const { bookingId } = useParams();
  const [data, setData] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [reviewStats, setReviewStats] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


  const fetchBooking = async () => {
    try {
      const res = await axios.get(`/v1/bookings/customer/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data?.statusCode === 200 && res.data?.data) {
        setData(res.data.data);
      } else {
        toast.error("No booking found for this ID.");
      }
    } catch (err) {
      console.error("Error fetching booking:", err);
      toast.error("Error fetching booking.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  // user detial fetch
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`/v1/bookings/customer/${bookingId}`);
        console.log("RAW DATA couponDiscountAmount:", data?.data?.couponDiscountAmount);
      console.log("PARSED couponDiscountAmount:", parseDecimal(data?.data?.couponDiscountAmount));
        setBookingData(res.data?.data);
      } catch (err) {
        console.error("Error fetching booking:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  // handle cancel booking
  const handleCancelBooking = async (reason) => {
    try {
      await axios.patch(
        `/v1/bookings/${data._id}/cancel`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Booking cancelled successfully!");
      setShowCancelModal(false);
      fetchBooking();
    } catch (error) {
      console.error("Cancel failed:", error);
      toast.error("Failed to cancel booking");
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`/v1/reviews/villa/${data?.villa?._id}`);
        setAllReviews(res.data.data);
      } catch (error) {
        console.error("Failed to fetch all reviews", error);
      }
    };

    if (data?.villa?._id) {
      fetchReviews();
    }
  }, [data?.villa?._id]);

 useEffect(() => {
  const fetchReviewStats = async () => {
    try {
      const res = await axios.get("/v1/reviews/villa-review-stats");
      setReviewStats(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch review stats", error);
    } finally {
      setLoading(false);
    }
  };

  fetchReviewStats();
}, []);

  const getReviewStatsForVilla = (villaId) => {
    return reviewStats.find((item) => item.villaId === villaId);
  };

  const parseDecimal = (val) => {
    if (!val) return 0;
    if (typeof val === "object" && val.$numberDecimal) {
      return Number(val.$numberDecimal);
    }
    return Number(val);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (!data || !data.villa) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No booking found.</p>
      </div>
    );
  }

  //  Can Cancel Logic
  const canCancel =
    data.status?.toLowerCase() === "confirmed" &&
    new Date(data.checkIn) > new Date();

function calculateBilling(data) {
  const pricePerNight = parseDecimal(data.pricePerNightAtBooking);
  const nights = data.nights;

  // ✅ Discounts
  const discountPercent = data.discountPercentApplied || 0;
  const couponDiscountAmount = parseDecimal(data.couponDiscountAmount) || 0;

  // ✅ Step 1: Subtotal
  const subtotal = pricePerNight * nights;

  // ✅ Step 2: Property Discount
  const discountAmount = (discountPercent / 100) * subtotal;

  // ✅ Step 3: After Discount + Coupon
  const costAfterDiscount = subtotal - discountAmount - couponDiscountAmount;

  // ✅ Step 4: GST (on net amount after discounts)
  const gstPercent = 18;
  const gstAmount = (gstPercent / 100) * costAfterDiscount;

  // ✅ Step 5: Additional Charges (backend se ya extra guest logic)
  const additionalCharges = parseDecimal(data.additionalCharges) || 0;

  // ✅ Step 6: Final Total
  const totalPayable = costAfterDiscount + gstAmount + additionalCharges;

  // ✅ Debug Logs
  console.log("➡️ Subtotal:", subtotal);
  console.log("➡️ Coupon Discount Amount:", couponDiscountAmount);
  console.log("➡️ Cost After Discounts:", costAfterDiscount);
  console.log("➡️ GST Amount:", gstAmount);
  console.log("➡️ Additional Charges:", additionalCharges);
  console.log("➡️ Final Total Payable:", totalPayable);

  return {
    ...data,
    subtotal,
    discountPercent,
    discountAmount,
    couponDiscountAmount,
    costAfterDiscount,
    gstAmount,
    additionalCharges,
    totalPayable,
  };
}




const bookingDataWithBilling = calculateBilling(data);

console.log("➡️ bookingDataWithBilling:", bookingDataWithBilling);


const {
  villa,
  status,
  checkIn,
  checkOut,
  nights,
  guests,
  pricePerNightAtBooking,
  couponCode,
  discountPercent,
  discountAmount,
  couponDiscountAmount,
  gstAmount,
  additionalCharges,
  totalPayable,
  _id,
  guestDetails,
} = bookingDataWithBilling;


  const fullAddress = `${villa?.villaName}, ${villa?.address?.street}, ${villa?.address?.city}, ${villa?.address?.state}, ${villa?.address?.country}, ${villa?.address?.zipcode}`;
  const encodedAddress = encodeURIComponent(fullAddress);

  return (
    <div className="px-2 sm:px-4 font-custom min-h-screen bg-[#f8f7f6] text-black">
      <div className="-mx-4 sm:-mx-8">
        <Gallery photos={villa.images} />
      </div>

      {/* Villa Title + Rating + Address + Get Direction */}
<div className="mt-4 max-w-7xl mx-auto">
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-6">
    {/* Left Side: Villa Info */}
    <div className="flex-1">
      {/* Villa Name */}
      <h1 className="text-3xl font-bold text-gray-900">
        {villa?.villaName}
      </h1>

      {/* Rating */}
      {(() => {
        const stats = getReviewStatsForVilla(villa._id);
        const averageRating = stats?.averageRating ?? 0.0;
        const reviewCount = stats?.reviewCount ?? 0;

        return (
          <a href="#reviews" className="flex mt-1 items-center gap-1 text-yellow-500 text-sm font-medium cursor-pointer hover:underline">
            <span className="text-base font-semibold">{averageRating.toFixed(1)}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.572-.955L10 0l2.94 5.955 6.572.955-4.756 4.635 1.122 6.545z" />
            </svg>
            <span className="text-gray-500 font-normal">
              ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
            </span>
          </a>
        );
      })()}

      {/* Address */}
      <p className="text-lg text-gray-800 mt-1">
        {`${villa?.address?.city}, ${villa?.address?.country}`}
      </p>
      <p className="text-sm text-gray-600 mt-1 leading-snug">
        {`${villa?.address?.street}, ${villa?.address?.city}, ${villa?.address?.state}, ${villa?.address?.country} - ${villa?.address?.zipcode}`}
      </p>

      {/* Get Directions Button */}
      
      {/* Embedded Map */}
      <div className="w-full sm:w-[410px] h-[300px] sm:h-[200px] mt-4 rounded-md overflow-hidden shadow">
        <iframe
          title="Google Map"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}`}
        ></iframe>
      </div>
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 mt-5 px-6 py-2 border border-gray-400 rounded-md text-sm text-black hover:bg-gray-200 w-full sm:w-fit"
      >
        <LocateIcon className="text-lg" />
        Get Directions
      </a>
          </div>

          {/* Right Side: Ratings & Review */}
          <div className="flex flex-col items-start sm:items-end sm:w-48">
            {/* Write Review Button */}
            {data?.status === "Completed" && (
              <>
                <button
                  className="bg-[#26223A] hover:bg-[#1e1a2f] text-white px-4 py-2 cursor-pointer rounded-md text-sm font-medium flex items-center justify-center gap-2  w-full sm:w-fit"
                  onClick={() => setShowReview(true)}
                >
                  ⭐ Rate your Stay
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {showReview && (
                  <ReviewForm
                    villaId={data?.villa?._id}
                    onClose={() => setShowReview(false)}
                    onReviewSubmitted={async () => {
                      const updatedData = await fetchVillaDetails(
                        data?.villa?._id
                      );
                      setData((prev) => ({ ...prev, villa: updatedData }));
                      fetchReview();
                    }}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto mt-8">
        {/* LEFT SIDE: Guest + Booking Details */}
        <div className="col-span-1 space-y-6">
          {/* Guest Details */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold border-b pb-2 mb-2 text-gray-800">
              Guest Details
            </h3>

            <div className="space-y-3 divide-y divide-gray-100">
              <div className="pt-2">
                <p>
                  <strong>Name:</strong>{" "}
                  {bookingData?.user?.firstName && bookingData?.user?.lastName
                    ? bookingData.user.firstName.charAt(0).toUpperCase() +
                      bookingData.user.firstName.slice(1).toLowerCase() +
                      " " +
                      bookingData.user.lastName.charAt(0).toUpperCase() +
                      bookingData.user.lastName.slice(1).toLowerCase()
                    : "Guest Name"}
                </p>
              </div>
              <div className="pt-2 pb-2">
                <p>
                  <strong>Phone:</strong>{" "}
                  {bookingData?.user?.phoneNumber || "Phone Number"}
                </p>
              </div>
              <div className="pt-2">
                <p>
                  <strong>Email:</strong>{" "}
                  {bookingData?.user?.email || "Email Address"}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-800">
              Booking Details
            </h3>

            <div className="space-y-3 divide-y divide-gray-100">
              <div className="pb-2">
                <p>
                  <strong>Booking ID:</strong> STAY{_id.slice(-7)}
                </p>
              </div>

              <div className="pt-2 pb-2">
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      status?.toLowerCase() === "cancelled"
                        ? "text-red-500"
                        : status?.toLowerCase() === "confirmed"
                        ? "text-green-600"
                        : status?.toLowerCase() === "pending"
                        ? "text-yellow-500"
                        : status?.toLowerCase() === "completed"
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    {status?.charAt(0).toUpperCase() + status?.slice(1)}
                  </span>
                </p>
              </div>

              <div className="pt-2 pb-2">
                <p>
                  <strong>Check-in:</strong>{" "}
                  {new Date(checkIn).toLocaleDateString()}
                </p>
              </div>

              <div className="pt-2 pb-2">
                <p>
                  <strong>Check-out:</strong>{" "}
                  {new Date(checkOut).toLocaleDateString()}
                </p>
              </div>

              <div className="pt-2">
                <p>
                  <strong>Guests:</strong> Adults: {guests?.adults || 0},
                  Children: {guests?.children || 0}, Pets: {guests?.pets || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Villa Info + Hotel Contact + Billing */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          {/* Villa Info */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-800">
              Villa Deatils
            </h3>

            <div className="space-y-3 divide-y divide-gray-100">
              <div className="flex flex-col gap-3 ">
                {/* BHK */}
                <div className="flex flex-col gap-2 pt-2 pb-2">
                  {/* BHK */}
                  <div className=" pb-2">
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2.5 py-1 rounded text-sm font-medium w-fit">
                      <FaHouse className="text-base" />
                      {villa.numberOfRooms} BHK
                    </span>
                  </div>

                  {/* Max Guest */}
                  <div className=" pb-2">
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2.5 py-1 rounded text-sm font-medium w-fit">
                      <FaPersonWalkingLuggage className="text-base" />
                      {villa.guestCapacity || (villa.numberOfRooms * 2)} Max Guest
                    </span>
                  </div>

                  {/* Rooms */}
                  <div className=" pb-2">
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2.5 py-1 rounded text-sm font-medium w-fit">
                      <FaDoorClosed className="text-base" />
                      {villa.numberOfRooms} Rooms
                    </span>
                  </div>
                </div>
              </div>

              <div className=" ">
                <p className="mt-2 pb-2">
                  <strong>Description:</strong>
                  <br />
                  {villa.description}
                </p>
              </div>

              <div className="mt-4">
  <strong className="block mb-2">Amenities</strong>
  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 text-xs">
    {(villa.amenities || []).map((item, idx) => (
      <div
        key={idx}
        className="flex flex-col items-center text-center"
      >
        <div className="text-xl">
          {/* Use amenity icon if available, otherwise fallback */}
          {amenityIcons[item] || <DotSquareIcon className="text-black text-xl" />}
        </div>
        <div className="mt-1 text-gray-700">{item}</div>
      </div>
    ))}
  </div>
</div>

            </div>
          </div>

          {/* Hotel Contact */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold border-b pb-2 mb-2 text-gray-800">
              Hotel Contact
            </h3>
            <div className="space-y-3 divide-y divide-gray-100">
              <div className="pt-2 pb-2">
                <p className="flex items-center gap-2 text-sm text-gray-800">
                  <Mail size={20} /> stayatlasin@gmail.com
                </p>
              </div>
              <div className="pt-2">
                <p className="flex items-center gap-2 text-sm text-gray-800 mt-1">
                  <Phone size={20} /> 2222334456
                </p>
              </div>
            </div>
          </div>

          {/* Billing Summary */}
<div className="bg-white p-4 rounded-xl shadow-sm">
  <h3 className="text-lg font-semibold border-b pb-2 mb-2 text-gray-800">
    Billing Summary
  </h3>
  <div className="space-y-3 divide-y divide-gray-100">
    
    {/* Room Price */}
    <div className="pt-2 pb-2">
      <p>
        <strong>Room Price:</strong> ₹
        {parseDecimal(pricePerNightAtBooking).toFixed(2)}
      </p>
    </div>

    {/* Nights */}
    <div className="pt-2 pb-2">
      <p>
        <strong>Total Nights:</strong> {nights}
      </p>
    </div>

    {/* Price x Nights */}
    <div className="pt-2 pb-2">
      <p>
        <strong>Price per Night:</strong> ₹
        {parseDecimal(pricePerNightAtBooking).toFixed(2)} X {nights}
      </p>
    </div>

    {/* Coupon Code */}
    <div className="pt-2 pb-2">
      <p>
        <strong>Coupon Code:</strong> {couponCode || "N/A"}
      </p>
    </div>

    {/* Property Discount */}
    {discountAmount > 0 && (
      <div className="pt-2 pb-2 text-green-700">
        <p>
          <strong>Property Discount:</strong> - ₹
          {parseDecimal(discountAmount).toFixed(2)}
        </p>
      </div>
    )}

    {/* Coupon Discount */}
    {couponDiscountAmount > 0 && (
      <div className="pt-2 pb-2 text-green-700">
        <p>
          <strong>Coupon Discount:</strong> - ₹
          {parseDecimal(couponDiscountAmount).toFixed(2)}
        </p>
      </div>
    )}
    

    {/* GST */}
    <div className="pt-2 pb-2">
      <p>
        <strong>GST (18%):</strong> ₹{parseDecimal(gstAmount).toFixed(2)}
      </p>
    </div>

    {/* Additional Charges */}
    {additionalCharges > 0 && (
      <div className="pt-2 pb-2 text-red-600">
        <p>
          <strong>Additional Charges:</strong> ₹
          {parseDecimal(additionalCharges).toFixed(2)}
        </p>
      </div>
    )}

    {/* Total */}
    <div className="border-t border-gray-400 pt-3 mt-3">
      <p className="font-bold text-lg text-black">
        Total Payable: ₹{parseDecimal(totalPayable).toFixed(2)}
      </p>
    </div>
  </div>
</div>




          {/* 👇 All Reviews Section */}
          {allReviews.length > 0 && (
            <div id="reviews" className="mt-6 border-t pt-6 w-full text-left !ml-0 !mr-auto">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Guest Reviews
              </h2>
              <ShowReview reviews={allReviews} />
            </div>
          )}

          {/* Cancel Button */}
          {canCancel && (
            <div className="text-right mt-4">
              <button
                onClick={() => setShowCancelModal(true)}
                className="text-sm bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Cancel Booking
              </button>
            </div>
          )}

          {/* Cancel Modal */}
          {showCancelModal && (
            <CancelBookingModal
              onClose={() => setShowCancelModal(false)}
              onSubmit={handleCancelBooking}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;