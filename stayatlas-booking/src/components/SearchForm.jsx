import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, CalendarDays, Users, Search, X, Minus, Plus } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { cities } from '@/utils/countriesCities';
import axios from '@/utils/axios';


// Simple DatePicker component since react-date-range might not work in artifacts
const SimpleDatePicker = ({ value, onChange, minDate }) => {
  const today = new Date().toISOString().split('T')[0];
  const minDateStr = minDate ? minDate.toISOString().split('T')[0] : today;
  
  return (
    <div className="space-y-4">
      {/* Calendar View */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="grid grid-cols-7 gap-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}
          {generateCalendarDays(value || new Date(), minDate, onChange)}
        </div>
      </div>

      {/* Direct Date Input */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-gray-600">Or enter date directly:</label>
    <input
      type="date"
      value={value ? value.toISOString().split('T')[0] : ''}
      onChange={(e) => onChange(new Date(e.target.value))}
      min={minDateStr}
      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
    />
      </div>
    </div>
  );
};

// Helper function to generate calendar days
const generateCalendarDays = (date, minDate, onChange) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const startPadding = firstDay.getDay();
  const days = [];
  
  // Add padding for days before the first of the month
  for (let i = 0; i < startPadding; i++) {
    days.push(<div key={`pad-${i}`} className="text-center py-2"></div>);
  }

  // Add the days of the month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const currentDate = new Date(date.getFullYear(), date.getMonth(), i);
    const isDisabled = minDate && currentDate < minDate;
    const isSelected = date && currentDate.toDateString() === date.toDateString();
    
    days.push(
      <button
        key={i}
        onClick={() => !isDisabled && onChange(currentDate)}
        disabled={isDisabled}
        className={`
          text-center py-2 rounded-full hover:bg-gray-100 transition-colors
          ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
          ${isSelected ? 'bg-green-500 text-white hover:bg-green-600' : ''}
        `}
      >
        {i}
      </button>
    );
  }

  return days;
};

// TwoMonthCalendar component: shows two months side by side, with navigation
const TwoMonthCalendar = ({ value, onChange, minDate, checkInDate }) => {
  const [baseMonth, setBaseMonth] = useState(() => {
    // Start from selected date's month, or today
    const d = value || new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  // Check if mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Helper to get next/prev month
  const addMonths = (date, n) => {
    return new Date(date.getFullYear(), date.getMonth() + n, 1);
  };

  // Month/year label
  const monthLabel = (date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Render a single month grid with header
  const renderMonthWithHeader = (date, isLeft) => (
    <div className="flex flex-col items-center flex-1 h-full m-0 pt-0 bg-white">
      <div className="flex items-center justify-between w-full mb-2 mt-2 px-2">
        <button
          onClick={() => setBaseMonth(addMonths(baseMonth, -1))}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
          aria-label="Previous month"
        >
          &#8592;
        </button>
        <div className="font-semibold text-lg text-center flex-1">{monthLabel(date)}</div>
        <button
          onClick={() => setBaseMonth(addMonths(baseMonth, 1))}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
          aria-label="Next month"
        >
          &#8594;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 w-full">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-500 py-1">{d}</div>
        ))}
        {generateCalendarDaysForMonth(date, value, minDate, onChange, checkInDate)}
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col justify-between items-center px-4">
      {/* Calendar View: responsive - one month on mobile, two on desktop */}
      <div className={`bg-white ${isMobile ? 'w-full max-w-sm' : 'w-[650px]'} h-[520px] p-6 flex flex-col items-stretch flex-1 m-0 border border-gray-200 shadow-lg rounded-xl overflow-hidden`}>
        <div className="flex w-full h-full gap-0">
          {renderMonthWithHeader(baseMonth, true)}
          {!isMobile && (
            <>
              <div className="w-[2px] h-[90%] bg-gray-100 shadow-md rounded-full mx-6 opacity-70" />
              {renderMonthWithHeader(addMonths(baseMonth, 1), false)}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper to generate days for a given month (for TwoMonthCalendar)
function generateCalendarDaysForMonth(monthDate, selectedDate, minDate, onChange, checkInDate) {
  // monthDate: first of month
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  // JS: 0=Sun, 1=Mon... so for Mon-start, shift
  let startPadding = (firstDay.getDay() + 6) % 7;
  const days = [];
  for (let i = 0; i < startPadding; i++) {
    days.push(<div key={`pad-${i}`} className="text-center py-2"></div>);
  }
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const currentDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), i);
    const isDisabled = minDate && currentDate < minDate;
    const isSelected = selectedDate && currentDate.toDateString() === selectedDate.toDateString();
    const isCheckInDate = checkInDate && currentDate.toDateString() === checkInDate.toDateString();
    
    // Check if the current date is between check-in and check-out
    const isInRange = checkInDate && selectedDate && 
      currentDate > checkInDate && 
      currentDate < selectedDate;
    
    days.push(
      <div key={i} className="text-center flex items-center justify-center">
        <button
          onClick={() => !isDisabled && onChange(currentDate)}
          disabled={isDisabled || isCheckInDate}
          className={`flex items-center justify-center w-8 h-8 transition-colors
            ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}
            ${isSelected || isCheckInDate ? 'bg-green-500 text-white rounded-full' : ''}
            ${isInRange ? 'bg-green-100 hover:bg-green-200' : ''}`}
        >
          {i}
        </button>
      </div>
    );
  }
  return days;
}

export default function SearchForm({ onSearch }) {
  const [activeSection, setActiveSection] = useState(null);
  const [showPopover, setShowPopover] = useState(false);
  const [showMobilePanel, setShowMobilePanel] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState({ adults: 1, children: 0, rooms: 1 });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [locationError, setLocationError] = useState("");



  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  // Add a ref for the dropdown and a click outside handler
  const guestDropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (guestDropdownRef.current && !guestDropdownRef.current.contains(event.target)) {
        setActiveSection(null);
      }
    }
    if (activeSection === 'guests') {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeSection]);

const allCities = Object.entries(cities).flatMap(([state, cityList]) =>
  cityList.map(city => ({ city, state }))
);

// Live suggestions state
const [remoteSuggestions, setRemoteSuggestions] = useState([]);

// Debounced fetch for suggestions when user types
useEffect(() => {
  const term = (query || '').trim();
  if (activeSection !== 'destination') return; // only when destination popover is open
  if (term.length < 2) {
    setRemoteSuggestions([]);
    return;
  }
  let cancelled = false;
  const t = setTimeout(async () => {
    try {
      const res = await axios.get('/v1/villas/suggestions', { params: { q: term } });
      if (!cancelled) {
        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        setRemoteSuggestions(data.map(s => ({ id: s.id, city: s.city || '', state: s.state || '', villaName: s.villaName || undefined })));
      }
    } catch (e) {
      if (!cancelled) setRemoteSuggestions([]);
    }
  }, 250);
  return () => { cancelled = true; clearTimeout(t); };
}, [query, activeSection]);

// Merge static cities with remote villa suggestions (dedupe)
const mergedLocations = React.useMemo(() => {
  const keyOf = (loc) => `${(loc.id||'')}:${(loc.villaName||'').toLowerCase()}|${(loc.city||'').toLowerCase()}|${(loc.state||'').toLowerCase()}`;
  const map = new Map();
  [...allCities, ...remoteSuggestions].forEach(loc => {
    const k = keyOf(loc);
    if (!map.has(k)) map.set(k, loc);
  });
  return Array.from(map.values());
}, [allCities, remoteSuggestions]);

const filteredCities = query
  ? mergedLocations.filter(loc =>
      (loc.villaName
        ? `${loc.villaName} - ${loc.city}, ${loc.state}`
        : `${loc.city}, ${loc.state}`
      )
        .toLowerCase()
        .includes(query.toLowerCase())
    )
  : mergedLocations;



  const [recentSearches, setRecentSearches] = useState(
  JSON.parse(localStorage.getItem('recentSearches')) || []
);

useEffect(() => {
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
}, [recentSearches]);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowPopover(false);
        setActiveSection(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showPopover && activeSection === "destination") {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [showPopover, activeSection]);

  // Helper functions for date formatting
  const formatDate = (date) => {
    if (!date) return "";
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const handleDateChange = (date, type) => {
    if (type === 'checkIn') {
      setCheckIn(date);
      if (checkOut && date >= checkOut) {
        setCheckOut(addDays(date, 1));
      }
    } else {
      setCheckOut(date);
    }
  };

  const increment = (type) => setGuests(prev => ({ 
    ...prev, 
    [type]: type === 'children' ? prev[type] + 1 : prev[type] + 1 
  }));
  
  const decrement = (type) => setGuests(prev => ({ 
    ...prev, 
    [type]: type === 'adults' ? Math.max(1, prev[type] - 1) : Math.max(0, prev[type] - 1)
  }));

  const openSection = (section) => {
    setActiveSection(section);
    setShowPopover(true);
  };

  const closePopover = () => {
    setShowPopover(false);
    setActiveSection(null);
  };

  const closeMobilePanel = () => {
    setShowMobilePanel(false);
    setActiveSection(null);
  };


useEffect(() => {
  const location = searchParams.get("location") || "";
  const start = searchParams.get("start") || "";
  const end = searchParams.get("end") || "";
  const guestsParam = parseInt(searchParams.get("guests") || "1");
  const roomsParam = parseInt(searchParams.get("rooms") || "1");

  setSelected(location);


  const checkInDate = start ? new Date(start) : null;
  const checkOutDate = end ? new Date(end) : null;

  setCheckIn(checkInDate);
  setCheckOut(checkOutDate);


  setGuests({
    adults: guestsParam > 0 ? guestsParam : 1,
    children: 0,
    rooms: roomsParam
  });
}, [searchParams]);


const handleSearch = () => {
  // 1️⃣ Ensure a location is selected
  if (!selected?.trim()) {
    setLocationError("Please select a location before searching!");
    openSection("destination");
    return;
  }
  setLocationError("");

  // 2️⃣ Determine the search string
  // If selected is an object (villa), use villaName; else, use the string
  const locationQuery =
    typeof selected === "object"
      ? selected.villaName
        ? `${selected.villaName} - ${selected.city}, ${selected.state}`
        : `${selected.city}, ${selected.state}`
      : selected.trim();

  // 3️⃣ Calculate total guests (minimum 1)
  const totalGuests = (guests?.adults || 0) + (guests?.children || 0) || 1;

  // 4️⃣ Convert check-in and check-out dates to ISO strings
  const startISO = checkIn ? new Date(checkIn).toISOString() : "";
  const endISO = checkOut ? new Date(checkOut).toISOString() : "";

  // 5️⃣ Navigate to search page with query parameters
  navigate(
    `/search?location=${encodeURIComponent(locationQuery)}&start=${encodeURIComponent(
      startISO
    )}&end=${encodeURIComponent(endISO)}&guests=${totalGuests}&rooms=${guests?.rooms || 1}`
  );

  // 6️⃣ Trigger onSearch callback if provided
  if (onSearch) {
    onSearch({
      location: locationQuery,
      checkIn: startISO,
      checkOut: endISO,
      guests: totalGuests,
      rooms: guests?.rooms || 1
    });
  }

  // 7️⃣ Close popovers and reset active section
  setShowPopover(false);
  setShowMobilePanel(false);
  setActiveSection(null);
};



  const highlightClass = (section) => 
    activeSection === section ? "ring-2 ring-green-500 bg-green-50" : "";

  // Mobile Layout
if (isMobile) {
  return (
    <div className="relative w-full">
      {/* Floating Collapsed Search Bar */}
      <div className="relative w-full mt-4 px-4">
        <div
          onClick={() => setShowMobilePanel(true)}
          className="bg-white rounded-full shadow-lg px-6 py-4 cursor-pointer border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <Search className="text-gray-600" size={20} />
            <div className="flex-1">
              <span className="text-gray-900 font-medium">Start your search</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">
                  {selected ? `${selected} • ` : "Where • "}
                  {checkIn && checkOut
                    ? `${formatDate(checkIn)} - ${formatDate(checkOut)} • `
                    : "When • "}
                  {guests.adults + guests.children} guest
                  {guests.adults + guests.children > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Search Panel */}
      <AnimatePresence>
        {showMobilePanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[9000] pt-20 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
              <button
                onClick={closeMobilePanel}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
              <h2 className="text-lg font-semibold">Search</h2>
              <div className="w-10"></div>
            </div>

            {/* Search Form Content */}
            <div className="p-4 space-y-6">
              {/* Destination */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Where</h3>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search destinations..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setActiveSection("destination")}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />

                  {activeSection === "destination" && (
  <div className="mt-4 space-y-3">

    {/* ===== Near Me ===== */}
    <div
      onClick={() => {
        navigator.geolocation.getCurrentPosition((pos) => {
          const { latitude, longitude } = pos.coords;
          const loc = {
            city: "Near Me",
            state: `Lat: ${latitude.toFixed(2)}, Lng: ${longitude.toFixed(2)}`,
          };
          const fullValue = `${loc.city}, ${loc.state}`;
          setSelected(fullValue);
          setQuery(fullValue);
          setRecentSearches((prev) => {
            const updated = [loc, ...prev.filter((p) => p.city !== loc.city)];
            return updated.slice(0, 5);
          });
          setActiveSection(null);
        });
      }}
      className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-emerald-50 border border-emerald-100 rounded-lg"
    >
      <MapPin className="h-4 w-4 text-emerald-600" />
      <span className="text-gray-700 text-sm font-medium">Near Me</span>
    </div>

    {/* ===== Recent Searches ===== */}
    {recentSearches.length > 0 && (
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-2">
          Recent Searches
        </h3>
        <ul>
          {recentSearches.map((loc, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer rounded-lg"
            >
              <div
                className="flex items-center gap-2"
                onClick={() => {
                  setSelected(`${loc.city}, ${loc.state}`);
                  setQuery(loc.city);
                  setActiveSection(null);
                }}
              >
                <MapPin className="h-4 w-4 text-emerald-600" />
                <div className="flex flex-col">
                  <span className="text-gray-700 text-sm font-medium">{loc.city}</span>
                  <span className="text-gray-500 text-xs">{loc.state}</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setRecentSearches((prev) => prev.filter((_, i) => i !== idx));
                }}
                className="text-gray-400 hover:text-red-500 text-sm"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* ===== Search More ===== */}
    {filteredCities.length > 0 && (
  <div>
    <h3 className="text-sm font-semibold text-gray-400 mb-2">
      Search More
    </h3>
    <div className="space-y-2 max-h-48 overflow-y-auto">
      {filteredCities.map((loc, idx) => (
        <button
          key={idx}
          onClick={() => {
            // If live villa suggestion has an id, go straight to villa page
            if (loc.id && loc.villaName) {
              navigate(`/booking/${loc.id}`);
              return;
            }
            // Otherwise treat as location selection
            setSelected(
              loc.villaName
                ? `${loc.villaName} - ${loc.city}, ${loc.state}`
                : `${loc.city}, ${loc.state}`
            );
            setQuery(loc.villaName || loc.city);
            setRecentSearches((prev) => {
              const updated = [loc, ...prev.filter((p) => p.city !== loc.city)];
              return updated.slice(0, 5);
            });
            setActiveSection("checkIn");
          }}
          className="w-full flex items-center gap-2 p-3 text-left rounded-lg border bg-white hover:bg-gray-50"
        >
          <MapPin className="h-4 w-4 text-emerald-600" />
          <div className="flex flex-col">
            <span className="text-gray-700 text-sm font-medium">
              {loc.villaName ? loc.villaName : loc.city}
            </span>
            <span className="text-gray-500 text-xs">
              {loc.villaName ? `${loc.city}, ${loc.state}` : loc.state}
            </span>
          </div>
        </button>
      ))}
    </div>
  </div>
)}


  </div>
)}

                </div>
              </div>

              {/* Dates */}
              <div>
                <h3 className="text-lg font-semibold mb-3">When</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setActiveSection("checkIn")}
                    className={`flex flex-col gap-2 p-4 rounded-xl border-2 cursor-pointer ${
                      activeSection === "checkIn"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200"
                    }`}
                  >
                    <CalendarDays className="text-gray-500" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Check-in</p>
                      <p className="text-sm font-medium text-gray-900">
                        {checkIn ? formatDate(checkIn) : "Add date"}
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveSection("checkOut")}
                    className={`flex flex-col gap-2 p-4 rounded-xl border-2 cursor-pointer ${
                      activeSection === "checkOut"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200"
                    }`}
                  >
                    <CalendarDays className="text-gray-500" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Check-out</p>
                      <p className="text-sm font-medium text-gray-900">
                        {checkOut ? formatDate(checkOut) : "Add date"}
                      </p>
                    </div>
                  </div>
                </div>
                {(activeSection === "checkIn" ||
                  activeSection === "checkOut") && (
                  <div className="mt-4">
                    <SimpleDatePicker
                      value={
                        activeSection === "checkIn" ? checkIn : checkOut
                      }
                      onChange={(date) => {
                        handleDateChange(date, activeSection);
                         if (activeSection === "checkIn") {
                      setActiveSection("checkOut"); // 👈 Auto next
                      } else {
                      setActiveSection("guests");   // 👈 Check-out ke baad guests
                    }
                      }}
                      minDate={
                        activeSection === "checkOut" && checkIn
                          ? checkIn
                          : new Date()
                      }
                    />
                  </div>
                )}
              </div>

              {/* Guests */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Who</h3>
                <div className="relative">
                  <div
                    onClick={() => setActiveSection("guests")}
                    className={`flex items-center gap-3 cursor-pointer flex-1 px-4 py-3 rounded-full border-2 ${
                      activeSection === "guests"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200"
                    }`}
                  >
                    <Users
                      className="text-gray-500 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-base text-gray-700 font-normal">
                      {guests.adults + guests.children} guests, {guests.rooms}{" "}
                      room{guests.rooms > 1 ? "s" : ""}
                    </span>
                  </div>
                  {activeSection === "guests" && (
                    <div className="mt-4 space-y-4 bg-white border rounded-xl p-4 shadow-lg">
                      {[
                        {
                          key: "adults",
                          label: "Adults",
                          desc: "Ages 13 or above",
                        },
                        {
                          key: "children",
                          label: "Children",
                          desc: "Ages 0-12",
                        },
                        {
                          key: "rooms",
                          label: "Rooms",
                          desc: "Number of bedrooms",
                        },
                      ].map(({ key, label, desc }) => (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <span className="font-medium text-gray-900">
                              {label}
                            </span>
                            <p className="text-xs text-gray-500">{desc}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => decrement(key)}
                              disabled={
                                guests[key] <=
                                (key === "adults" || key === "rooms" ? 1 : 0)
                              }
                              className="w-10 h-10 flex items-center justify-center border-2 border-emerald-500 rounded-lg hover:bg-emerald-50 disabled:opacity-50"
                            >
                              <Minus
                                size={18}
                                className="text-emerald-600"
                              />
                            </button>
                            <span className="w-8 text-center font-bold">
                              {guests[key]}
                            </span>
                            <button
                              onClick={() => increment(key)}
                              className="w-10 h-10 flex items-center justify-center border-2 border-emerald-500 rounded-lg hover:bg-emerald-50"
                            >
                              <Plus
                                size={18}
                                className="text-emerald-600"
                              />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Search Button */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <button
                onClick={handleSearch}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-medium hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Search size={20} />
                Search
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


  // Desktop Layout
  return (
    <div className="relative w-full max-w-7xl mx-auto mt-10">
      <div className="flex items-center w-full bg-white rounded-full shadow-lg px-6 py-4 gap-6">
        <div
          onClick={() => openSection("destination")}
          className={`flex items-center gap-3 cursor-pointer flex-1 px-4 py-3 rounded-full transition-all ${highlightClass("destination")}`}
        >
          <MapPin className="text-gray-500 flex-shrink-0" size={20} />
          <input
            type="text"
            ref={inputRef}
            placeholder={locationError || "Where are you going?"}
            value={query || selected}
            onChange={(e) => { setQuery(e.target.value); setSelected(""); setLocationError("");}}
            className="bg-transparent w-full placeholder:text-gray-500 focus:outline-none text-base font-normal"
            onFocus={() => openSection("destination")}
          />
        </div>

        <div className="w-px h-8 bg-gray-300"></div>

        <div
          onClick={() => openSection("checkIn")}
          className={`flex items-center gap-3 cursor-pointer px-4 py-3 rounded-full transition-all ${highlightClass("checkIn")}`}
        >
          <CalendarDays className="text-gray-500 flex-shrink-0" size={20} />
          <span className="text-base text-gray-700 font-normal whitespace-nowrap">
            {checkIn ? formatDate(checkIn) : "Check-in"}
          </span>
        </div>

        <div className="w-px h-8 bg-gray-300"></div>

        <div
          onClick={() => openSection("checkOut")}
          className={`flex items-center gap-3 cursor-pointer px-4 py-3 rounded-full transition-all ${highlightClass("checkOut")}`}
        >
          <CalendarDays className="text-gray-500 flex-shrink-0" size={20} />
          <span className="text-base text-gray-700 font-normal whitespace-nowrap">
            {checkOut ? formatDate(checkOut) : "Check-out"}
          </span>
        </div>

        <div className="w-px h-8 bg-gray-300"></div>

        <div className="relative">
          <div
            onClick={() => setActiveSection('guests')}
            className={`flex items-center gap-3 cursor-pointer flex-1 px-4 py-3 rounded-full transition-all ${highlightClass('guests')}`}
          >
            <Users className="text-gray-500 flex-shrink-0" size={20} />
            <span className="text-base text-gray-700 font-normal">
              {guests.adults + guests.children} guests, {guests.rooms} room{guests.rooms > 1 ? 's' : ''}
            </span>
          </div>
          {activeSection === 'guests' && (
            <div
              ref={guestDropdownRef}
              className="absolute left-0 mt-2 w-80 bg-white border border-emerald-200 rounded-xl shadow-xl z-50 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Select Guests</h3>
                <button
                  onClick={() => setActiveSection(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { key: 'adults', label: 'Adults', desc: 'Ages 13 or above' },
                  { key: 'children', label: 'Children', desc: 'Ages 0-12' },
                  { key: 'rooms', label: 'Rooms', desc: 'Number of bedrooms' }
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <span className="text-gray-800 font-semibold text-base">{label}</span>
                      {desc && <p className="text-xs text-gray-500">{desc}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => decrement(key)}
                        className="w-10 h-10 flex items-center justify-center border-2 border-emerald-500 rounded-lg hover:bg-emerald-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={guests[key] <= (key === 'adults' || key === 'rooms' ? 1 : 0)}
                      >
                        <Minus size={18} className="text-emerald-600" />
                      </button>
                      <span className="w-10 text-center font-bold text-lg text-gray-800">{guests[key]}</span>
                      <button
                        onClick={() => increment(key)}
                        className="w-10 h-10 flex items-center justify-center border-2 border-emerald-500 rounded-lg hover:bg-emerald-50 transition-all duration-200"
                      >
                        <Plus size={18} className="text-emerald-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={handleSearch}
          className="bg-green-600 p-4 rounded-full text-white hover:bg-green-700 transition-colors flex-shrink-0"
        >
          <Search size={20} />
        </button>
      </div>

      {/* Desktop Popovers */}
      <AnimatePresence>
        {showPopover && (
          <motion.div
            ref={wrapperRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 z-50 mt-4 w-[700px] bg-white shadow-2xl rounded-2xl p-0 border"
          >
            {/* Destination Popover */}
            {activeSection === "destination" && (
  <div className="w-[700px] p-6">

    {/* ===== Near Me ===== */}
    <div
      onClick={() => {
  navigator.geolocation.getCurrentPosition((pos) => {
    const { latitude, longitude } = pos.coords;
    const loc = {
      city: "Near Me",
      state: `Lat: ${latitude.toFixed(2)}, Lng: ${longitude.toFixed(2)}`
    };
    const fullValue = `${loc.city}, ${loc.state}`;
    setSelected(fullValue);
    setQuery(fullValue); 
    setRecentSearches(prev => {
      const updated = [loc, ...prev.filter(p => p.city !== loc.city)];
      return updated.slice(0, 5);
    });
    closePopover();
  });
}}

      className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-emerald-50 border-b border-emerald-100"
    >
      <MapPin className="h-4 w-4 text-emerald-600" />
      <span className="text-gray-700 text-sm font-medium">Near Me</span>
    </div>

    {/* ===== Recent Searches ===== */}
    {recentSearches.length > 0 && (
      <div className="border-b border-emerald-100 mt-2">
        <h3 className="text-sm font-semibold text-gray-400 mb-1 ml-4">Recent Searches</h3>
        <ul>
          {recentSearches.map((loc, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer"
            >
              <div
                className="flex items-center gap-2"
                onClick={() => {
                  setSelected(`${loc.city}, ${loc.state}`);
                  setQuery(loc.city);
                  closePopover();
                }}
              >
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span className="text-gray-700 text-sm font-medium">{loc.city}</span>
                <span className="text-gray-500 text-xs">{loc.state}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setRecentSearches(prev => prev.filter((_, i) => i !== idx));
                }}
                className="text-gray-400 hover:text-red-500 text-sm"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* ===== Search More ===== */}
    {filteredCities.length > 0 && (
  <div className="mt-2 max-h-64 overflow-y-auto">
    <div className="px-4 py-2 text-sm text-gray-400 font-semibold">Search More</div>
    {filteredCities.map((loc, idx) => (
      <button
        key={idx}
        onClick={() => {
          if (loc.id && loc.villaName) {
            navigate(`/booking/${loc.id}`);
            return;
          }
          setSelected(
            loc.villaName
              ? `${loc.villaName} - ${loc.city}, ${loc.state}`
              : `${loc.city}, ${loc.state}`
          );
          setQuery(loc.villaName || loc.city);
          setRecentSearches(prev => {
            const updated = [loc, ...prev.filter(p => p.city !== loc.city)];
            return updated.slice(0, 5);
          });
          setActiveSection("checkIn");
        }}
        className="w-[600px] flex justify-between px-4 py-2 text-left rounded-lg transition-all border-b border-emerald-100 hover:bg-emerald-50"
      >
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-600" />
            <span className="text-gray-700 text-sm font-medium">
              {loc.villaName ? loc.villaName : loc.city}
            </span>
          </div>
          <span className="text-gray-500 text-xs ml-6">
            {loc.villaName ? `${loc.city}, ${loc.state}` : loc.state}
          </span>
        </div>
        <span className="text-gray-400 text-xs">
          {loc.villaName ? "Villa" : "City"}
        </span>
      </button>
    ))}
  </div>
)}


  </div>
)}

            {/* Date Popovers */}
            {(activeSection === "checkIn" || activeSection === "checkOut") && (
              <div className="relative w-full p-0">
                <div className="flex items-center justify-between px-12 pt-8 pb-4">
                  <h3 className="text-xl font-semibold">
                  {activeSection === "checkIn" ? "Check-in date" : "Check-out date"}
                </h3>
                  <button
                    onClick={closePopover}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Close"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="flex items-center justify-center w-full pb-8">
                  <TwoMonthCalendar
                  value={activeSection === "checkIn" ? checkIn : checkOut}
                  onChange={(date) => {
                    handleDateChange(date, activeSection);
                     if (activeSection === "checkIn") {
                      setActiveSection("checkOut"); // 👈 Auto next
                      } else {
                      setActiveSection("guests");   // 👈 Check-out ke baad guests
                    }
                  }}
                  minDate={activeSection === "checkOut" && checkIn ? checkIn : new Date()}
                    checkInDate={activeSection === "checkOut" ? checkIn : null}
                />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}