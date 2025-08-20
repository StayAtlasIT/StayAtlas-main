// src/components/PaymentSummary.jsx
import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { ChevronDown, ChevronUp, Tag, CheckCircle, XCircle, Users } from 'lucide-react';
import { format } from 'date-fns';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import axios from "../utils/axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import confetti from "canvas-confetti";
import OffersSection from "./Offfers";

// Helper function to parse decimal values safely
const parseDecimal = (val) => {
  if (!val) return 0;
  if (typeof val === "object" && val.$numberDecimal) {
    return Number(val.$numberDecimal);
  }
  return Number(val);
};

// Centralized function to calculate all booking charges
const calculateBookingCharges = (
  property,
  startDate,
  endDate,
  adults,
  pets,
  children,
  appliedCouponDiscountAmount = 0
) => {
  if (!property || !startDate || !endDate) {
    return {
      totalNights: 0,
      totalCost: 0,
      weekdayNightsCost: 0,
      weekendNightsCost: 0,
      weekdayNights: 0,
      weekendNights: 0,
      subtotal: 0,
      discount: property?.discountPercent || 0,
      discountAmount: 0,
      couponDiscountAmount: 0,
      gst: 18,
      gstAmount: 0,
      additionalCharges: 0,
    };
  }

  const weekdayPrice = parseDecimal(property.pricePerNightBoth?.weekday || 0);
  const weekendPrice = parseDecimal(property.pricePerNightBoth?.weekend || 0);

  let totalNights = 0;
  let weekdayNights = 0;
  let weekendNights = 0;
  let subtotal = 0;

  let currentDate = new Date(startDate);
  const checkOutDate = new Date(endDate);

  while (currentDate < checkOutDate) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      subtotal += weekendPrice;
      weekendNights++;
    } else {
      subtotal += weekdayPrice;
      weekdayNights++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
    totalNights++;
  }

  const discount = property.discountPercent || 0;
  const discountAmount = (discount / 100) * subtotal;
  const costAfterDiscount = subtotal - discountAmount - appliedCouponDiscountAmount;

  const gst = 18;
  const gstAmount = (gst / 100) * costAfterDiscount;

  const extraChargeTaken = 1000;
  const totalPeople = adults + children + pets;
  const allowedPeople = property.numberOfRooms * 2;
  const extraPeople = Math.max(0, totalPeople - allowedPeople);
  const additionalCharges = extraPeople * extraChargeTaken;

  const totalCost = costAfterDiscount + gstAmount + additionalCharges;

  return {
    totalNights,
    totalCost,
    weekdayNightsCost: weekdayNights * weekdayPrice,
    weekendNightsCost: weekendNights * weekendPrice,
    weekdayNights,
    weekendNights,
    subtotal,
    discount,
    discountAmount,
    couponDiscountAmount: appliedCouponDiscountAmount,
    gst,
    gstAmount,
    additionalCharges,
  };
};

const CustomDateInput = forwardRef(({ value, onClick, label, time }, ref) => (
  <div className="w-full cursor-pointer" onClick={onClick} ref={ref}>
    <label className="text-xs text-gray-500">{label}</label>
    <div className="mt-1">
      {value ? (
        <>
          <p className="text-[17px] font-semibold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{time}</p>
        </>
      ) : (
        <p className="text-[15px] text-gray-400">Select date</p>
      )}
    </div>
  </div>
));

const PaymentSummary = ({ property: propProperty, setTotalPayable }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const location = useLocation();

  const [property, setProperty] = useState(propProperty);
  const [propertyLoading, setPropertyLoading] = useState(!propProperty);
  const [guestDropdownOpen, setGuestDropdownOpen] = useState(false);
  const [adults, setAdults] = useState(1);
  const [pets, setPets] = useState(0);
  const [children, setChildren] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [error, setError] = useState("");
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [showOffers, setShowOffers] = useState(false);

  const guestBoxRef = useRef();
  const cardRef = useRef(null);
  const [charges, setCharges] = useState({});

  useEffect(() => {
    if (charges.totalCost > 0) {
      setTotalPayable(charges.totalCost);
    }
  }, [charges.totalCost, setTotalPayable]);

  const fetchPropertyById = async (villaId) => {
    try {
      setPropertyLoading(true);
      const response = await axios.get(`/v1/villas/${villaId}`);
      if (response.data && response.data.data) {
        setProperty(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load villa details");
    } finally {
      setPropertyLoading(false);
    }
  };

  // NEW: Effect to load initial booking data
  useEffect(() => {
    let bookingData = null;
    
    if (location.state?.bookingData) {
      bookingData = location.state.bookingData;
      localStorage.setItem("pendingBookingData", JSON.stringify(bookingData));
    } else {
      const storedData = localStorage.getItem("pendingBookingData");
      if (storedData) {
        try {
          bookingData = JSON.parse(storedData);
        } catch (e) {
          console.error("Error parsing stored booking data:", e);
        }
      }
    }

    if (bookingData) {
      setAdults(bookingData.guests?.adults || bookingData.adults || 1);
      setPets(bookingData.guests?.pets || bookingData.pets || 0);
      setChildren(bookingData.guests?.children || bookingData.children || 0);
      
      if (bookingData.checkIn) {
        setStartDate(new Date(bookingData.checkIn));
      }
      if (bookingData.checkOut) {
        setEndDate(new Date(bookingData.checkOut));
      }
      
      if (bookingData.couponCode) {
        setCouponCode(bookingData.couponCode);
      }
      
      if (bookingData.villa && !id && !propProperty) {
        fetchPropertyById(bookingData.villa);
      }
    } else {
        if (!propProperty && id) {
            fetchPropertyById(id);
        } else if (propProperty) {
            setProperty(propProperty);
            setPropertyLoading(false);
        }
    }
  }, [location.state, propProperty, id]);

  // NEW: Dedicated useEffect to watch for property and couponCode changes
  useEffect(() => {
    // Only run this effect if a coupon is set and we have all the data needed to calculate the subtotal
    if (couponCode && property && startDate && endDate) {
      const applyInitialCoupon = async () => {
        try {
          const { data } = await axios.post("/v1/offers/validate", { code: couponCode });
          if (data.success) {
            setAppliedCoupon(couponCode);
            let discountValue = data.data.discountAmount;
            
            if (typeof discountValue === "string" && discountValue.includes("%")) {
              const subtotalForCalc = calculateBookingCharges(
                property,
                startDate,
                endDate,
                adults,
                pets,
                children
              ).subtotal;
              const percentage = parseFloat(discountValue.match(/\d+/)[0]);
              discountValue = (percentage / 100) * subtotalForCalc;
            } else {
              discountValue = Number(discountValue) || 0;
            }
            setCouponDiscountAmount(discountValue);
          } else {
            console.error("Auto-applied coupon is invalid.");
            setAppliedCoupon(null);
            setCouponCode("");
            setCouponDiscountAmount(0);
          }
        } catch (err) {
          console.error("Failed to apply coupon on page load:", err);
          setAppliedCoupon(null);
          setCouponCode("");
          setCouponDiscountAmount(0);
        }
      };
      applyInitialCoupon();
    } else {
      // Reset coupon if property, dates, or coupon code are not fully loaded
      setAppliedCoupon(null);
      setCouponDiscountAmount(0);
    }
  }, [couponCode, property, startDate, endDate, adults, pets, children]);

  // Update charges whenever relevant state changes
  useEffect(() => {
    if (property && startDate && endDate) {
      const newCharges = calculateBookingCharges(
        property,
        startDate,
        endDate,
        adults,
        pets,
        children,
        couponDiscountAmount
      );
      setCharges(newCharges);
    } else {
        setCharges({});
    }
  }, [property, startDate, endDate, adults, pets, children, couponDiscountAmount]);

  // Handle click outside for guest dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (guestBoxRef.current && !guestBoxRef.current.contains(e.target)) {
        setGuestDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Coupon apply handler (for manual entry)
  const handleApply = async () => {
    if (!couponCode.trim()) {
      setError("Please enter a coupon code");
      return;
    }

    try {
      setError("");
      const { data } = await axios.post("/v1/offers/validate", { code: couponCode });

      if (data.success) {
        setAppliedCoupon(couponCode);
        let discountValue = data.data.discountAmount;

        if (typeof discountValue === "string" && discountValue.includes("%")) {
          const subtotal = charges?.subtotal || 0;
          const percentage = parseFloat(discountValue.match(/\d+/)[0]);
          discountValue = (percentage / 100) * subtotal;
        } else {
          discountValue = Number(discountValue) || 0;
        }

        setCouponDiscountAmount(discountValue);

        if (cardRef?.current) {
          const rect = cardRef.current.getBoundingClientRect();
          const originX = (rect.left + rect.width / 2) / window.innerWidth;
          const originY = (rect.top + rect.height / 2) / window.innerHeight;
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { x: originX, y: originY },
            colors: ["#ff0", "#0f0", "#00f", "#ff69b4", "#ff4500"],
          });
        }
      } else {
        setError("Invalid coupon code");
        setAppliedCoupon(null);
        setCouponDiscountAmount(0);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleRemove = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponDiscountAmount(0);
  };

  const handleOfferSelect = (code) => {
    setCouponCode(code);
    setShowOffers(false);
  };

  return (
    <div className="w-full lg:w-[400px] relative">
      <div className="lg:sticky lg:top-24">
        <div className="space-y-6 p-6 shadow-xl rounded-2xl text-sm w-full border border-gray-200 bg-gradient-to-br from-green-50 via-yellow-50 to-white ring-1 ring-green-100 transition-all duration-300 ease-in-out">
          {/* Price */}
          <div className="text-[22px] font-extrabold text-gray-900">
            ₹
            {(() => {
              const totalNights = charges.totalNights;
              if (startDate && endDate && totalNights > 0) {
                return Math.round(charges.totalCost / totalNights);
              } else {
                const today = new Date();
                const day = today.getDay();
                const isWeekend = day === 0 || day === 6;
                return isWeekend
                  ? parseDecimal(property?.pricePerNightBoth?.weekend || 0).toFixed(0)
                  : parseDecimal(property?.pricePerNightBoth?.weekday || 0).toFixed(0);
              }
            })()}
            <span className="text-sm font-medium text-gray-600">
              / Per Night + Taxes
              {(() => {
                const refDate = startDate || new Date();
                const day = refDate.getDay();
                const isWeekend = day === 0 || day === 6;
                return startDate && endDate && charges.totalNights > 0
                  ? ""
                  : ` (${isWeekend ? "Weekend" : "Weekday"})`;
              })()}
            </span>
          </div>

          {/* Dates */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl shadow border">
              <div className="w-full sm:w-1/2 border-r sm:pr-4">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  minDate={new Date()}
                  maxDate={endDate}
                  customInput={
                    <CustomDateInput
                      label="Check-in"
                      time="1:00pm"
                      value={startDate ? format(startDate, "EEE, dd MMM") : ""}
                    />
                  }
                />
              </div>
              <div className="w-full sm:w-1/2 sm:pl-4">
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={
                    startDate
                      ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
                      : new Date(Date.now() + 24 * 60 * 60 * 1000)
                  }
                  customInput={
                    <CustomDateInput
                      label="Check-out"
                      time="11:00am"
                      value={endDate ? format(endDate, "EEE, dd MMM") : ""}
                    />
                  }
                />
              </div>
            </div>
          </div>

          {/* Guests & Rooms */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div ref={guestBoxRef} className="w-full space-y-1 relative">
              <div
                onClick={() => setGuestDropdownOpen(!guestDropdownOpen)}
                className="border px-3 py-3 rounded-lg cursor-pointer bg-white hover:bg-[#0D1F1E]/10 transition flex items-center justify-between w-full"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span>{adults + children + pets} Guests</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
              <div
                className={`absolute left-0 top-full mt-2 w-full transition-all duration-300 rounded-xl shadow-xl bg-white border border-[#E6A655]/30 z-50 overflow-hidden ${
                  guestDropdownOpen
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <div className="p-4 space-y-4">
                  {[
                    { label: "Adults", value: adults, setter: setAdults },
                    { label: "Pets", value: pets, setter: setPets },
                    {
                      label: "Children Under 6",
                      value: children,
                      setter: setChildren,
                    },
                  ].map(({ label, value, setter }) => (
                    <div
                      key={label}
                      className="flex justify-between items-center text-gray-700"
                    >
                      <span>{label}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setter(Math.max(0, value - 1))}
                          className="w-7 h-7 text-lg rounded-full border hover:bg-[#0D1F1E]/10"
                        >
                          -
                        </button>
                        <span className="w-6 text-center">{value}</span>
                        <button
                          onClick={() => setter(value + 1)}
                          className="w-7 h-7 text-lg rounded-full border hover:bg-[#0D1F1E]/10"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setGuestDropdownOpen(false)}
                      className="bg-[#0D1F1E] text-white w-full py-1.5 rounded-lg text-xs hover:bg-[#102A29]"
                    >
                      APPLY
                    </button>
                    <button
                      onClick={() => {
                        setAdults(1);
                        setPets(0);
                        setChildren(0);
                      }}
                      className="border w-full py-1.5 rounded-lg text-xs hover:bg-[#F8F8F8]"
                    >
                      CLEAR
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coupon */}
          <div className="w-full max-w-md mx-auto">
            {!appliedCoupon ? (
              <div className="border border-gray-300 p-3 rounded-xl flex items-center gap-2">
                <Tag className="text-green-600 w-5 h-5" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 outline-none text-sm"
                />
                <button
                  onClick={handleApply}
                  className="text-green-700 font-semibold text-sm hover:underline"
                >
                  Apply
                </button>
              </div>
            ) : (
              <div className="border border-green-200 bg-green-50 p-3 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-600 w-5 h-5" />
                  <div>
                    <span className="font-semibold text-green-700">
                      {appliedCoupon}
                    </span>
                    <br />
                    <span className="text-xs text-green-600">
                      You saved ₹{couponDiscountAmount.toFixed(2)} on this booking
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleRemove}
                  className="text-red-600 font-semibold text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
                <XCircle className="w-4 h-4" /> {error}
              </div>
            )}
            <div
              onClick={() => setShowOffers(true)}
              className="flex justify-center items-center text-xs text-blue-600 mt-1 cursor-pointer hover:underline"
            >
              View offers →
            </div>
          </div>

          {/* Charges Table */}
          <div className="text-sm text-gray-800">
            <div className="flex justify-between items-center font-bold text-black text-base py-2">
              <span>Total</span>
              <span className="text-lg text-black">
                ₹{charges.totalCost?.toFixed(2) || "0.00"}
              </span>
            </div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1"
            >
              {showDetails ? "Hide details" : "See details"}
              {showDetails ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
            <div
              className={`transition-all duration-300 overflow-hidden ${
                showDetails ? "max-h-[500px] mt-2" : "max-h-0"
              }`}
            >
              <table className="w-full mt-2">
                <tbody>
                  {charges.weekdayNights > 0 && (
                    <tr>
                      <td>
                        {charges.weekdayNights} Weekday{" "}
                        {charges.weekdayNights > 1 ? "nights" : "night"}
                      </td>
                      <td className="text-right">
                        ₹{charges.weekdayNightsCost?.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                  )}
                  {charges.weekendNights > 0 && (
                    <tr>
                      <td>
                        {charges.weekendNights} Weekend{" "}
                        {charges.weekendNights > 1 ? "nights" : "night"}
                      </td>
                      <td className="text-right">
                        ₹{charges.weekendNightsCost?.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td>Subtotal</td>
                    <td className="text-right">₹{charges.subtotal?.toFixed(2) || "0.00"}</td>
                  </tr>
                  {/* <tr>
                    <td>Flat {charges.discount}% off</td>
                    <td className="text-right text-green-600">
                      -₹{charges.discountAmount?.toFixed(2) || "0.00"}
                    </td>
                  </tr> */}
                  {appliedCoupon && charges.couponDiscountAmount > 0 && (
                    <tr>
                      <td>Coupon "{appliedCoupon}" Applied</td>
                      <td className="text-right text-green-600">
                        -₹{charges.couponDiscountAmount?.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td>GST (as per government guidelines)</td>
                    <td className="text-right text-red-600">
                      +₹{charges.gstAmount?.toFixed(2) || "0.00"}
                    </td>
                  </tr>
                  <tr>
                    <td>Additional Charges</td>
                    <td className="text-right">
                      +₹{charges.additionalCharges?.toFixed(2) || "0.00"}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="text-xs text-gray-500 pt-1">
                Incl. all taxes and charges
              </p>
            </div>
          </div>

          {/* Contact Host */}
          <button
            ref={cardRef}
            className="w-full border py-2 rounded-xl text-xs font-bold text-center hover:bg-gray-100 transition"
          >
            CONTACT YOUR HOST <br />
            +91 8591131447
          </button>
        </div>
      </div>

      {/* Offers Modal */}
      {showOffers && (
        <div
          className="fixed top-[16%] left-1/2 transform -translate-x-1/2
                      w-[95%] sm:w-[650px] lg:w-[1000px] 
                      h-[70%] bg-white shadow-2xl z-[9999] 
                      overflow-hidden rounded-xl transition-transform duration-300 flex flex-col"
        >
          <div className="flex justify-end p-2">
            <button
              onClick={() => setShowOffers(false)}
              className="text-gray-600 hover:text-black text-2xl"
            >
              ✖
            </button>
          </div>
          <div className="flex-1 scale-90 sm:scale-85 md:scale-90 origin-top">
            <OffersSection onOfferSelect={handleOfferSelect} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSummary;