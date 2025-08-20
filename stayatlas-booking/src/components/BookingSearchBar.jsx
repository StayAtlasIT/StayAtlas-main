import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion, AnimatePresence } from "framer-motion";

const locations = ["Goa", "Jaipur", "Mumbai", "Delhi", "Manali", "Udaipur"];

export default function BookingBar({ onResults }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  // >>> MISSING PART 1: ADD nights STATE
  const [nights, setNights] = useState(0); 
  const wrapperRef = useRef(null);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const [infants, setInfants] = useState(0);

  // >>> MISSING PART 2: ADD useEffect TO CALCULATE NIGHTS
  useEffect(() => {
    if (checkIn && checkOut) {
      const diff = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      setNights(diff);
    } else {
      setNights(0); // Reset nights if dates are cleared
    }
  }, [checkIn, checkOut]);

  // Update total guests when adults/children/infants change (Good to have)
  useEffect(() => {
    setGuests(adults + children + infants);
  }, [adults, children, infants]);

  const handleLocationChange = (e) => {
    const input = e.target.value;
    setLocation(input);
    setSuggestions(
      locations.filter((loc) => loc.toLowerCase().includes(input.toLowerCase()))
    );
  };

  const handleSearch = async () => {
    if (!location || !checkIn || !checkOut || guests === 0) {
      alert("Please fill all fields and select at least one guest.");
      return;
    }

    try {
      const res = await fetch("/api/v1/villas/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location,
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
          guests, 
          // >>> MISSING PART 3: PASS nights IN REQUEST BODY
          nights, 
        }),
      });

      if (!res.ok) throw new Error("Something went wrong");

      const data = await res.json();
      console.log("Villas Found:", data);

      // >>> MISSING PART 4: PASS nights TO onResults CALLBACK
      if (onResults) onResults(data, nights); 
      setIsExpanded(false);
    } catch (error) {
      console.error("Search failed:", error.message);
      alert("Failed to fetch villas");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSuggestions([]);
        // setIsExpanded(false); // Keep expanded after initial click for better UX
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="pt-6 flex justify-center items-center" ref={wrapperRef}>
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.div
            key="compact"
            onClick={() => setIsExpanded(true)}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-full shadow-lg px-6 py-4 flex items-center gap-6 border border-[#002B20] cursor-pointer"
          >
            <span className="text-sm text-gray-700">
              {location ? location : "Add location"}
            </span>

            <span className="border-l pl-6 text-sm text-gray-700">
              {checkIn && checkOut
                ? `${checkIn.toLocaleDateString('en-GB')} - ${checkOut.toLocaleDateString('en-GB')}`
                : "Select Date"}
            </span>
            <span className="border-l pl-6 text-sm text-gray-700">
              {guests || 1} Guest{guests > 1 ? "s" : ""}
            </span>
            <button className="ml-auto bg-[#002B20] text-white px-3 py-2 rounded-full">
              🔍
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-[3rem] shadow-lg p-4 flex justify-center items-center flex-wrap md:flex-nowrap gap-4 border border-[#002B20] w-full max-w-5xl"
          >
            {/* Location */}
            <div className="relative w-full md:w-1/4">
              <label className="block text-sm text-gray-500 mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={handleLocationChange}
                placeholder="Search for a location"
                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002B20]"
              />
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bg-white border mt-1 rounded-md w-full shadow z-50"
                  >
                    {suggestions.map((loc, i) => (
                      <li
                        key={i}
                        className="px-2 py-1 hover:bg-[#e7f3ef] cursor-pointer"
                        onClick={() => {
                          setLocation(loc);
                          setSuggestions([]);
                        }}
                      >
                        {loc}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* Check-in */}
            <div className="w-full md:w-1/5">
              <label className="block text-sm text-gray-500 mb-1">
                Check In
              </label>
              <DatePicker
                selected={checkIn}
                onChange={(date) => {
                  setCheckIn(date);
                  if (checkOut && date >= checkOut) setCheckOut(null);
                }}
                minDate={new Date()}
                placeholderText="Add Checkin"
                dateFormat="dd/MM/yyyy"
                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002B20]"
              />
            </div>

            {/* Check-out */}
            <div className="w-full md:w-1/5">
              <label className="block text-sm text-gray-500 mb-1">
                Check Out
              </label>
              <DatePicker
                selected={checkOut}
                onChange={(date) => setCheckOut(date)}
                minDate={
                  checkIn ? new Date(checkIn.getTime() + 86400000) : new Date()
                }
                placeholderText="Add Checkout"
                dateFormat="dd/MM/yyyy"
                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002B20]"
              />
            </div>

            {/* Guests Dropdown */}
            <div className="w-full md:w-1/6 relative">
              <label className="block text-sm text-gray-500 mb-1">Guests</label>
              <div
                onClick={() => setShowGuestDropdown(!showGuestDropdown)}
                className="p-2 border border-gray-300 rounded-md cursor-pointer"
              >
                {adults + children + infants} Guest
                {adults + children + infants > 1 ? "s" : ""}
              </div>

              {showGuestDropdown && (
                <div className="absolute z-50 bg-white border rounded-md p-4 mt-1 w-64 shadow-lg">
                  {[
                    {
                      label: "Adults",
                      age: "Age 13 years and more",
                      state: adults,
                      setState: setAdults,
                    },
                    {
                      label: "Children",
                      age: "Age 3–12 years",
                      state: children,
                      setState: setChildren,
                    },
                    {
                      label: "Infants",
                      age: "Age 0–2 years",
                      state: infants,
                      setState: setInfants,
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center mb-3"
                    >
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.age}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            item.setState(Math.max(0, item.state - 1))
                          }
                          className="px-2 py-1 border rounded"
                        >
                          -
                        </button>
                        <span className="w-6 text-center">
                          {String(item.state).padStart(2, "0")}
                        </span>
                        <button
                          onClick={() => item.setState(item.state + 1)}
                          className="px-2 py-1 border rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between">
                    <button
                      onClick={() => {
                        setAdults(1);
                        setChildren(0);
                        setInfants(0);
                        setShowGuestDropdown(false); 
                      }}
                      className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setShowGuestDropdown(false)}
                      className="px-3 py-1 rounded bg-[#002B20] text-white hover:bg-[#001f18] text-sm"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="w-full md:w-auto bg-[#002B20] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#001f18] transition-colors duration-200"
            >
              Search
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}