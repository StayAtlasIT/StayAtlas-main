import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Calendar, Users, Search, Plus, Minus, X, RotateCcw } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams, useNavigate } from "react-router-dom";
import { cities } from '@/utils/countriesCities';
import axios from '@/utils/axios';

// Custom CSS for DatePicker
const datePickerStyles = `
  .react-datepicker {
    font-family: inherit;
    border: 2px solid #10b981;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
  .react-datepicker__header {
    background-color: #10b981;
    border-bottom: 2px solid #10b981;
    border-radius: 10px 10px 0 0;
  }
  .react-datepicker__current-month {
    color: white;
    font-weight: 600;
  }
  .react-datepicker__day-name {
    color: white;
  }
  .react-datepicker__day--selected {
    background-color: #10b981 !important;
    border-radius: 50%;
  }
  .react-datepicker__day--keyboard-selected {
    background-color: #10b981 !important;
    border-radius: 50%;
  }
  .react-datepicker__day:hover {
    background-color: #d1fae5 !important;
    border-radius: 50%;
  }
  .react-datepicker__day--disabled {
    color: #d1d5db;
  }
`;

export const cityStateList = Object.entries(cities).flatMap(([state, cityArr]) =>
  cityArr.map((city) => ({ city, state }))
);


const addMonths = (date, n) => new Date(date.getFullYear(), date.getMonth() + n, 1);
const monthLabel = (date) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};
function generateCalendarDaysForMonth(monthDate, selectedDate, minDate, onChange, checkInDate) {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
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
    const isInRange = checkInDate && selectedDate && currentDate > checkInDate && currentDate < selectedDate;
   
    days.push(
      <div key={i} className="text-center flex items-center justify-center">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            if (!isDisabled) {
              console.log('Date button clicked:', currentDate, 'isDisabled:', isDisabled);
              onChange(currentDate);
            } else {
              console.log('Date is disabled:', currentDate);
            }
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          disabled={isDisabled}
          className={`flex items-center justify-center w-8 h-8 transition-colors
            ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}
            ${isSelected ? 'bg-emerald-500 text-white rounded-full' : ''}
            ${isCheckInDate ? 'bg-emerald-600 text-white rounded-full' : ''}
            ${isInRange ? 'bg-emerald-100 hover:bg-emerald-200' : ''}`}
        >
          {i}
        </button>
      </div>
    );
  }
  return days;
}

// Helper function to format date in dd/mm/yyyy format
const formatDate = (date) => {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const TwoMonthCalendar = ({ value, onChange, minDate, checkInDate, onClose }) => {
  const [baseMonth, setBaseMonth] = useState(() => {
    const d = value || new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [isMobile, setIsMobile] = useState(false);
 
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDateSelect = (date) => {
    console.log('TwoMonthCalendar: Date selected:', date);
    onChange(date);
    // Don't close calendar immediately - let parent decide
  };

  const renderMonthWithHeader = (date, isLeft) => (
    <div className="flex flex-col items-center flex-1 h-full m-0 pt-0 bg-white">
      <div className="flex items-center justify-between w-full mb-1 mt-1 px-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setBaseMonth(addMonths(baseMonth, -1));
          }}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
          aria-label="Previous month"
        >&#8592;</button>
        <div className="font-semibold text-base text-center flex-1">{monthLabel(date)}</div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setBaseMonth(addMonths(baseMonth, 1));
          }}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
          aria-label="Next month"
        >&#8594;</button>
      </div>
      <div className="grid grid-cols-7 gap-1 w-full">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-500 py-0.5">{d}</div>
        ))}
        {generateCalendarDaysForMonth(date, value, minDate, handleDateSelect, checkInDate)}
      </div>
    </div>
  );
 
  return (
    <div className="w-full flex flex-col justify-between items-center px-4">
      <div
        className={`bg-white ${isMobile ? 'w-full max-w-sm' : 'w-[650px]'} h-[300px] p-2 flex flex-col items-stretch flex-1 m-0 border border-gray-200 shadow-lg rounded-xl overflow-hidden relative`}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {onClose && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
            aria-label="Close calendar"
          >
            <X size={16} className="text-gray-600" />
          </button>
        )}
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

// Add a single month calendar for tablet/mobile use
const SingleMonthCalendar = ({ value, onChange, minDate, checkInDate, onClose }) => {
  const [baseMonth, setBaseMonth] = useState(() => {
    const d = value || new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  useEffect(() => {
    setBaseMonth(value ? new Date(value.getFullYear(), value.getMonth(), 1) : new Date());
  }, [value]);
  return (
    <div className="w-full flex flex-col justify-between items-center px-2">
      <div className="bg-white w-full max-w-xs h-[300px] p-2 flex flex-col items-stretch flex-1 m-0 border border-gray-200 shadow-lg rounded-xl overflow-hidden relative">
        {onClose && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
            aria-label="Close calendar"
          >
            <X size={16} className="text-gray-600" />
          </button>
        )}
        <div className="flex w-full h-full gap-0">
          <div className="flex flex-col items-center flex-1 h-full m-0 pt-0 bg-white">
            <div className="flex items-center justify-between w-full mb-1 mt-1 px-6">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setBaseMonth(new Date(baseMonth.getFullYear(), baseMonth.getMonth() - 1, 1));
                }}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                aria-label="Previous month"
              >&#8592;</button>
              <div className="font-semibold text-base text-center flex-1">{monthLabel(baseMonth)}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setBaseMonth(new Date(baseMonth.getFullYear(), baseMonth.getMonth() + 1, 1));
                }}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                aria-label="Next month"
              >&#8594;</button>
            </div>
            <div className="grid grid-cols-7 gap-1 w-full">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d} className="text-center text-xs font-medium text-gray-500 py-0.5">{d}</div>
              ))}
              {generateCalendarDaysForMonth(baseMonth, value, minDate, onChange, checkInDate)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



const SearchForm = () => {
  // Inject custom styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = datePickerStyles;
    document.head.appendChild(styleElement);
   
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // State management
  const [locationDesktop, setLocationDesktop] = useState('');
  const [locationMobile, setLocationMobile] = useState('');
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState({ adults: 1, children: 0, rooms: 1 });

  // UI state
  const [showLocationPopupDesktop, setShowLocationPopupDesktop] = useState(false);
  const [showLocationPopupMobile, setShowLocationPopupMobile] = useState(false);
  const [showGuestPopoverDesktop, setShowGuestPopoverDesktop] = useState(false);
  const [showGuestPopoverMobile, setShowGuestPopoverMobile] = useState(false);
  const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
  const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false);
  const [showMobileFullSearch, setShowMobileFullSearch] = useState(false);
  const [locationError, setLocationError] = useState("");


  const navigate = useNavigate();

  // Refs
  const destinationInputRef = useRef(null);
  const destinationDropdownRef = useRef(null);
  const guestInputRef = useRef(null);
  const guestDropdownRef = useRef(null);
  const guestPopoverRef = useRef(null);
  const checkInCalendarRef = useRef(null);
  const checkOutCalendarRef = useRef(null);

  const today = new Date().toISOString().split('T')[0];
  const locationRef = useRef(null);
  const [searchParams] = useSearchParams();

  const [recentSearches, setRecentSearches] = useState(() => {
  return JSON.parse(localStorage.getItem("recentSearches")) || [];
});


// Remote live suggestions for villas and locations
const [remoteSuggestions, setRemoteSuggestions] = useState([]);

// Debounced fetch for suggestions
useEffect(() => {
  const term = (locationDesktop || locationMobile || '').trim();
  if (term.length < 2) {
    setRemoteSuggestions([]);
    return;
  }
  let cancelled = false;
  const timer = setTimeout(async () => {
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
  return () => { cancelled = true; clearTimeout(timer); };
}, [locationDesktop, locationMobile]);

// Merge static city/state with remote villa suggestions
const mergedLocations = React.useMemo(() => {
  const keyOf = (loc) => `${(loc.id||'')}:${(loc.villaName||'').toLowerCase()}|${(loc.city||'').toLowerCase()}|${(loc.state||'').toLowerCase()}`;
  const map = new Map();
  [...cityStateList, ...remoteSuggestions].forEach(loc => {
    const k = keyOf(loc);
    if (!map.has(k)) map.set(k, loc);
  });
  return Array.from(map.values());
}, [remoteSuggestions]);

const filteredLocationsDesktop = mergedLocations.filter((loc) => {
  const searchTerm = locationDesktop.toLowerCase();
  return (
    loc.city.toLowerCase().includes(searchTerm) ||
    loc.state.toLowerCase().includes(searchTerm) ||
    (loc.villaName && loc.villaName.toLowerCase().includes(searchTerm))
  );
});

const filteredLocationsMobile = mergedLocations.filter((loc) => {
  const searchTerm = locationMobile.toLowerCase();
  return (
    loc.city.toLowerCase().includes(searchTerm) ||
    loc.state.toLowerCase().includes(searchTerm) ||
    (loc.villaName && loc.villaName.toLowerCase().includes(searchTerm))
  );
});


const handleSelectLocationDesktop = (loc) => {
  const displayName = loc.villaName
    ? `${loc.villaName}`
    : `${loc.city}, ${loc.state}`;

  setLocationDesktop(displayName);
  setShowLocationPopupDesktop(false);

  let updated = [loc, ...recentSearches.filter(r =>
    r.city !== loc.city || r.villaName !== loc.villaName
  )];
  updated = updated.slice(0, 5);
  setRecentSearches(updated);
  localStorage.setItem("recentSearches", JSON.stringify(updated));

  setTimeout(() => {
    if (checkInCalendarRef?.current) {
      checkInCalendarRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setShowCheckInCalendar(true);
  }, 200);
};


// 2️⃣ Check-in select → open Check-out
const handleCheckInSelect = (date) => {
  setCheckIn(date);
  setShowCheckInCalendar(false);

  // Open Check-out calendar
  setTimeout(() => {
    setShowCheckOutCalendar(true);
  }, 200);
};

// 3️⃣ Check-out select → open Guests popover
const handleCheckOutSelect = (date) => {
  if (checkIn && date && date.toDateString() === checkIn.toDateString()) return;
  setCheckOut(date);
  setShowCheckOutCalendar(false);

  // Open Guests & Rooms
  setTimeout(() => {
    setShowGuestPopoverDesktop(true);
  }, 200);
};

// 4️⃣ When guest selection is done → close popover
const handleGuestsDone = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setShowGuestPopoverDesktop(false);
  setShowGuestPopoverMobile(false);
};

 const handleSelectLocationMobile = (loc) => {
  console.log("Mobile location selected:", loc);
  setLocationMobile(`${loc.city}, ${loc.state}`);
  setShowLocationPopupMobile(false);

    // Save recent searches
  let updated = [loc, ...recentSearches.filter(r => r.city !== loc.city)];
  updated = updated.slice(0, 5); // max 5
  setRecentSearches(updated);
  localStorage.setItem("recentSearches", JSON.stringify(updated));

      // Move to Check-in step
  setTimeout(() => {
    if (checkInCalendarRef?.current) {
      checkInCalendarRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setShowCheckInCalendar(true);
  }, 200);
};



  const formatGuestText = () => {
    const totalGuests = guests.adults + guests.children;
    return `${totalGuests} Guest${totalGuests > 1 ? 's' : ''}, ${guests.rooms} Room${guests.rooms > 1 ? 's' : ''}`;
  };

  const updateGuestCount = (key, delta) => {
    setGuests((prev) => {
      const newVal = prev[key] + delta;
      if (key === 'adults' || key === 'rooms') {
        if (newVal < 1) return prev;
      } else if (key === 'children') {
        if (newVal < 0) return prev;
      }
      console.log(`Updating ${key}: ${prev[key]} + ${delta} = ${newVal}`);
      return { ...prev, [key]: newVal };
    });
  };

  const handleClear = () => {
    setLocationDesktop('');
    setLocationMobile('');
    setCheckIn(null);
    setCheckOut(null);
    setGuests({ adults: 1, children: 0, rooms: 1 });
  };

  useEffect(() => {
  const locationParam = searchParams.get("location") || "";
  const startParam = searchParams.get("start") || "";
  const endParam = searchParams.get("end") || "";
  const guestsParam = parseInt(searchParams.get("guests") || "1");
  const roomsParam = parseInt(searchParams.get("rooms") || "1");


  setLocationDesktop(locationParam);
  setLocationMobile(locationParam);

  // Dates as Date objects
  const checkInDate = startParam ? new Date(startParam) : null;
  const checkOutDate = endParam ? new Date(endParam) : null;
  setCheckIn(checkInDate);
  setCheckOut(checkOutDate);

  // Guests
  setGuests({
    adults: guestsParam > 0 ? guestsParam : 1,
    children: 0,
    rooms: roomsParam
  });
}, [searchParams]);


const handleSearch = () => {
  setShowCheckInCalendar(false);
  setShowCheckOutCalendar(false);

  let location = locationDesktop || locationMobile || "";
  location = location.trim();

  const totalGuests = (guests?.adults || 0) + (guests?.children || 0) || 1;
  const startISO = checkIn ? new Date(checkIn).toISOString() : "";
  const endISO = checkOut ? new Date(checkOut).toISOString() : "";

  // 1️⃣ Check if villa name exists in remoteSuggestions
  const selectedVilla = remoteSuggestions.find(s => {
    const candidate = s.villaName 
      ? `${s.villaName}` 
      : `${s.city}, ${s.state}`;
    return candidate.toLowerCase() === location.toLowerCase();
  });

  if (selectedVilla?.id) {
    // Directly navigate to villa details page
    navigate(`/booking/${selectedVilla.id}`);
    return;
  }

  // 2️⃣ Otherwise → search by city/state
  navigate(
    `/search?location=${encodeURIComponent(location)}&start=${encodeURIComponent(startISO)}&end=${encodeURIComponent(endISO)}&guests=${totalGuests}&rooms=${guests?.rooms || 1}`
  );
};


  // Click outside handler for all dropdowns/popovers
  useEffect(() => {
    function handleClickOutside(event) {
      const isDestinationInput = destinationInputRef.current && destinationInputRef.current.contains(event.target);
      const isDestinationDropdown = destinationDropdownRef.current && destinationDropdownRef.current.contains(event.target);
      const isGuestInput = guestInputRef.current && guestInputRef.current.contains(event.target);
      const isGuestDropdown = guestDropdownRef.current && guestDropdownRef.current.contains(event.target);
      const isGuestPopover = guestPopoverRef.current && guestPopoverRef.current.contains(event.target);
      const isCheckInCalendar = checkInCalendarRef.current && checkInCalendarRef.current.contains(event.target);
      const isCheckOutCalendar = checkOutCalendarRef.current && checkOutCalendarRef.current.contains(event.target);
     
      // Don't close calendars if clicking inside them
      if (isCheckInCalendar || isCheckOutCalendar) {
        return;
      }
     
      // Only close dropdowns if clicking outside all of them
      if (!isDestinationInput && !isDestinationDropdown && !isGuestInput && !isGuestDropdown && !isGuestPopover && !isCheckInCalendar && !isCheckOutCalendar) {
        // Close dropdowns immediately
        setShowLocationPopupDesktop(false);
        setShowLocationPopupMobile(false);
        setShowGuestPopoverDesktop(false);
        setShowGuestPopoverMobile(false);
        // Only close the calendar that is open
        setTimeout(() => {
          if (showCheckInCalendar) setShowCheckInCalendar(false);
          if (showCheckOutCalendar) setShowCheckOutCalendar(false);
        }, 100);
      }
    }
   
    if (showLocationPopupDesktop || showLocationPopupMobile || showGuestPopoverDesktop || showGuestPopoverMobile || showCheckInCalendar || showCheckOutCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
   
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLocationPopupDesktop, showLocationPopupMobile, showGuestPopoverDesktop, showGuestPopoverMobile, showCheckInCalendar, showCheckOutCalendar]);

  // Click outside handler for mobile search bar
  useEffect(() => {
    function handleMobileSearchClickOutside(event) {
      // Check if click is outside the mobile search bar
      const mobileSearchContainer = event.target.closest('.mobile-search-container');
      const mobileSearchButton = event.target.closest('.mobile-search-button');
     
      if (!mobileSearchContainer && !mobileSearchButton && showMobileFullSearch) {
        setShowMobileFullSearch(false);
      }
    }
   
    if (showMobileFullSearch) {
      document.addEventListener('mousedown', handleMobileSearchClickOutside);
    } else {
      document.removeEventListener('mousedown', handleMobileSearchClickOutside);
    }
   
    return () => {
      document.removeEventListener('mousedown', handleMobileSearchClickOutside);
    };
  }, [showMobileFullSearch]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-0 relative z-[3000]">
      {/* Desktop view */}
      <div className="hidden lg:flex mx-auto justify-center w-[100%] max-w-7xl z-50 relative">
        <div className="bg-white/10 backdrop-blur-none border border-white rounded-2xl shadow-2xl p-6 w-full">
          <div className="grid lg:[grid-template-columns:1.6fr_1fr_1fr_1fr_.9fr] xl:[grid-template-columns:2fr_1.5fr_1.5fr_1.5fr_1fr] gap-3 items-end relative z-[3000]">
           
            <div className="relative" ref={locationRef}>
              <label className="block text-sm font-semibold text-white mb-2">
                Destination
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 h-5 w-5" />
                <input
                  ref={destinationInputRef}
                  type="text"
                  value={locationDesktop}
                  onChange={(e) => {
                    setLocationDesktop(e.target.value);
                    setLocationError("");
                    setShowLocationPopupDesktop(true);
                    setShowLocationPopupMobile(false);
                    setShowGuestPopoverDesktop(false);
                    setShowGuestPopoverMobile(false);
                    setShowCheckInCalendar(false);
                    setShowCheckOutCalendar(false);
                  }}
                  onFocus={() => {
                    setShowLocationPopupDesktop(true);
                    setShowLocationPopupMobile(false);
                    setShowGuestPopoverDesktop(false);
                    setShowGuestPopoverMobile(false);
                    setShowCheckInCalendar(false);
                    setShowCheckOutCalendar(false);
                  }}
                  placeholder={locationError || "Where are you going?"}
                  required
                  className={`w-full pl-10 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-gray-700 placeholder-gray-400 bg-white
      ${locationError ? "border-green-500 focus:ring-green-500" : "border-emerald-300 focus:ring-emerald-500 focus:border-emerald-500"}`}
                />
              </div>
             
             {showLocationPopupDesktop && (
  <div
   ref={destinationDropdownRef}
   className="absolute top-full left-0 mt-2 w-[500px] bg-white border-2 border-emerald-200 rounded-xl shadow-xl z-[9999] max-h-[60vh] overflow-y-auto"
   onClick={(e) => e.stopPropagation()}
   onMouseDown={(e) => e.stopPropagation()}
 >

    {/* ===== Near Me ===== */}
    <div
      onClick={() => {
        navigator.geolocation.getCurrentPosition((pos) => {
          const { latitude, longitude } = pos.coords;
          console.log("📍 Current location:", latitude, longitude);
          handleSelectLocationDesktop({
            city: "Near Me",
            state: `Lat: ${latitude.toFixed(2)}, Lng: ${longitude.toFixed(2)}`
          });
        });
      }}
      className="px-4 py-2 cursor-pointer hover:bg-emerald-50 border-b border-emerald-100 flex items-center gap-2"
    >
      <MapPin className="h-4 w-4 text-emerald-600" />
      <span className="text-gray-700 font-medium text-sm">Near Me</span>
    </div>

    {/* ===== Recent Searches ===== */}
    {recentSearches.length > 0 && (
  <div className="mt-2 border-b border-emerald-100">
    <h3 className="text-sm font-semibold text-gray-400 mb-1 ml-4">Recent Searches</h3>
    <ul>
      {recentSearches.map((loc, idx) => (
        <li
          key={idx}
          className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer "
        >
          <div
            className="flex items-center gap-2"
            onClick={() => handleSelectLocationDesktop(loc)}
          >
            <MapPin className="h-4 w-4 text-emerald-600 ml-2" />
            <span className="text-gray-700 font-medium text-sm">{loc.city}</span>
            <span className="text-gray-500 text-xs">{loc.state}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const updated = recentSearches.filter((_, i) => i !== idx);
              setRecentSearches(updated);
              localStorage.setItem("recentSearches", JSON.stringify(updated));
            }}
            className="text-gray-400 hover:text-red-500 "
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  </div>
)}


    {/* ===== Filtered Locations ===== */}
    {filteredLocationsDesktop.length > 0 && (
  <div>
    <div className="px-4 py-2 text-sm text-gray-400 font-semibold">
      Search More
    </div>
    {filteredLocationsDesktop.map((loc, idx) => (
      <div
        key={`search-${idx}`}
        onClick={() => handleSelectLocationDesktop(loc)}
        className="px-4 py-1 cursor-pointer hover:bg-emerald-50 border-b border-emerald-100 flex justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-600" />
            <span className="text-gray-700 text-sm font-medium">
              {loc.villaName ? `${loc.villaName}` : `${loc.city}, ${loc.state}`}
            </span>
          </div>
          {!loc.villaName && (
            <span className="text-gray-500 text-xs ml-6">{loc.state}</span>
          )}
        </div>
        <span className="text-gray-400 text-sm">
          {loc.villaName ? "Villa" : "City"}
        </span>
      </div>
    ))}
  </div>
)}


  </div>
)}
            </div>

           
            <div className="relative">
              <label className="block text-sm font-semibold text-white mb-2">
                Check in
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 h-5 w-5" />
                <input
                  type="text"
                  value={formatDate(checkIn)}
                  className="w-full pl-10 pr-4 py-4 border-2 border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-gray-700 bg-white cursor-pointer hover:border-emerald-500 hover:ring-2 hover:ring-emerald-400"
                  onFocus={() => {
                    setShowCheckInCalendar(true);
                    setShowCheckOutCalendar(false);
                    setShowLocationPopupDesktop(false);
                    setShowLocationPopupMobile(false);
                    setShowGuestPopoverDesktop(false);
                    setShowGuestPopoverMobile(false);
                  }}
                  readOnly
                  placeholder="Check-in"
                />
              </div>
              {showCheckInCalendar && (
                <div ref={checkInCalendarRef} className="absolute z-[5000] top-full left-12 mt-2 w-auto">
                  <TwoMonthCalendar
                    value={checkIn}
                    onChange={handleCheckInSelect}   // ✅ use function
                    minDate={new Date()}
                    onClose={() => setShowCheckInCalendar(false)}
                  />

                </div>
              )}
            </div>

            {/* Check out */}
            <div className="relative">
              <label className="block text-sm font-semibold text-white mb-2">
                Check out
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 h-5 w-5" />
                <input
                  type="text"
                  value={formatDate(checkOut)}
                  className="w-full pl-10 pr-4 py-4 border-2 border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-gray-700 bg-white cursor-pointer hover:border-emerald-500 hover:ring-2 hover:ring-emerald-400"
                  onFocus={() => {
                    if (!checkIn) return; // Prevent opening calendar if no check-in
                    setShowCheckOutCalendar(true);
                    setShowCheckInCalendar(false);
                    setShowLocationPopupDesktop(false);
                    setShowLocationPopupMobile(false);
                    setShowGuestPopoverDesktop(false);
                    setShowGuestPopoverMobile(false);
                  }}
                  readOnly
                  placeholder="Check-out"
                />
              </div>
              {showCheckOutCalendar && (
                <div ref={checkOutCalendarRef} className="absolute z-[5000] top-full left-0 mt-2 w-auto">
                  <TwoMonthCalendar
                    value={checkOut}
                     onChange={handleCheckOutSelect}
                    minDate={checkIn ? new Date(checkIn.getTime() + 86400000) : new Date()}
                    checkInDate={checkIn}
                    onClose={() => setShowCheckOutCalendar(false)}
                  />
                </div>
              )}
            </div>

         
            <div className="relative" ref={guestPopoverRef}>
              <label className="block text-sm font-semibold text-white mb-2">
                Guests and rooms
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 h-5 w-5" />
                <input
                  ref={guestInputRef}
                  type="text"
                  value={formatGuestText()}
                  readOnly
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Desktop guests input clicked, current state:', showGuestPopoverDesktop);
                    setShowGuestPopoverDesktop(!showGuestPopoverDesktop);
                    setShowLocationPopupDesktop(false);
                    setShowLocationPopupMobile(false);
                    setShowGuestPopoverMobile(false);
                    setShowCheckInCalendar(false);
                    setShowCheckOutCalendar(false);
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className={`w-full pl-10 pr-4 py-4 border-2 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-gray-700 bg-white ${
                    showGuestPopoverDesktop
                      ? 'border-emerald-500 ring-2 ring-emerald-400 bg-emerald-50'
                      : 'border-emerald-300 hover:border-emerald-500 hover:ring-2 hover:ring-emerald-400'
                  }`}
                />
              </div>

              {showGuestPopoverDesktop && (
                <div
                  ref={guestDropdownRef}
                  className="absolute top-full left-0 mt-2 bg-white border-2 border-emerald-200 rounded-xl shadow-xl p-2 min-w-[260px] max-w-md z-40"
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-gray-800">Select Guests</h3>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowGuestPopoverDesktop(false);
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X size={16} className="text-gray-600" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {[
                      { key: 'adults', label: 'Adults', desc: 'Ages 13 or above' },
                      { key: 'children', label: 'Children', desc: 'Ages 2-12' },
                      { key: 'rooms', label: 'Rooms' }
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div>
                          <span className="font-semibold text-gray-800 text-sm">{label}</span>
                          {desc && <p className="text-xs text-gray-500">{desc}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              updateGuestCount(key, -1);
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="w-7 h-7 flex items-center justify-center border-2 border-emerald-500 rounded-lg hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={guests[key] <= (key === 'adults' || key === 'rooms' ? 1 : 0)}
                          >
                            <Minus size={12} className="text-emerald-600" />
                          </button>
                          <span className="w-7 text-center font-bold text-sm text-gray-800">{guests[key]}</span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              updateGuestCount(key, 1);
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="w-7 h-7 flex items-center justify-center border-2 border-emerald-500 rounded-lg hover:bg-emerald-50 transition-colors"
                          >
                            <Plus size={12} className="text-emerald-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
  onClick={handleGuestsDone}
  onMouseDown={(e) => {
    e.preventDefault();
    e.stopPropagation();
  }}
  className="w-full mt-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg transition-all duration-200 text-sm"
>
  Done
</button>

                </div>
              )}
            </div>

           
            <div>
              <button
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border-2 border-amber-400"
              >
                <Search size={20} />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tablet view (760px–1024px) - disabled to use compact bubble */}
      <div className="hidden">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl shadow-2xl border-2 border-emerald-200 p-4 md:p-6">
          <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4">
           
            <div className="relative col-span-2" ref={locationRef}>
              <label className="block text-sm font-semibold text-emerald-800 mb-2">
                Destination
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 h-5 w-5" />
                <input
                  type="text"
                  value={locationMobile}
                  onChange={(e) => setLocationMobile(e.target.value)}
                  onFocus={() => {
                    setShowLocationPopupMobile(true);
                    setShowLocationPopupDesktop(false);
                    setShowGuestPopoverDesktop(false);
                    setShowGuestPopoverMobile(false);
                    setShowCheckInCalendar(false);
                    setShowCheckOutCalendar(false);
                  }}
                  placeholder="Where are you going?"
                  className="w-full pl-10 pr-3 py-3 md:py-4 border-2 border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white"
                />
              </div>
             
                {showLocationPopupMobile && (
  <div
   className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-emerald-200 rounded-lg shadow-2xl z-[5000] max-h-[60vh] overflow-y-auto"
   onClick={(e) => e.stopPropagation()}
 >

    {/* ===== Near Me ===== */}
    <div
      onClick={() => {
        navigator.geolocation.getCurrentPosition((pos) => {
          const { latitude, longitude } = pos.coords;
          console.log("📍 Current location:", latitude, longitude);
          handleSelectLocationDesktop({
            city: "Near Me",
            state: `Lat: ${latitude.toFixed(2)}, Lng: ${longitude.toFixed(2)}`
          });
        });
      }}
      className="px-4 py-2 cursor-pointer hover:bg-emerald-50 border-b border-emerald-100 flex items-center gap-2"
    >
      <MapPin className="h-4 w-4 text-emerald-600" />
      <span className="text-gray-700 font-medium text-sm">Near Me</span>
    </div>

    {/* ===== Recent Searches ===== */}
    {recentSearches.length > 0 && (
  <div className="mt-2 border-b border-emerald-100">
    <h3 className="text-sm font-semibold text-gray-400 mb-1 ml-4">Recent Searches</h3>
    <ul>
      {recentSearches.map((loc, idx) => (
        <li
          key={idx}
          className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer "
        >
          <div
            className="flex items-center gap-2"
            onClick={() => handleSelectLocationDesktop(loc)}
          >
            <MapPin className="h-4 w-4 text-emerald-600 ml-2" />
            <span className="text-gray-700 font-medium text-sm">{loc.city}</span>
            <span className="text-gray-500 text-xs">{loc.state}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const updated = recentSearches.filter((_, i) => i !== idx);
              setRecentSearches(updated);
              localStorage.setItem("recentSearches", JSON.stringify(updated));
            }}
            className="text-gray-400 hover:text-red-500 "
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  </div>
)}


    {/* ===== Filtered Locations ===== */}
    {filteredLocationsDesktop.length > 0 && (
  <div>
    <div className="px-4 py-2 text-sm text-gray-400 font-semibold">
      Search More
    </div>
    {filteredLocationsDesktop.map((loc, idx) => (
      <div
        key={`search-${idx}`}
        onClick={() => handleSelectLocationDesktop(loc)}
        className="px-4 py-1 cursor-pointer hover:bg-emerald-50 border-b border-emerald-100 flex justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-600" />
            <span className="text-gray-700 text-sm font-medium">
              {loc.villaName ? `${loc.villaName}` : `${loc.city}, ${loc.state}`}
            </span>
          </div>
          {!loc.villaName && (
            <span className="text-gray-500 text-xs ml-6">{loc.state}</span>
          )}
        </div>
        <span className="text-gray-400 text-sm">
          {loc.villaName ? "Villa" : "City"}
        </span>
      </div>
    ))}
  </div>
)}


  </div>
)}
            </div>

            {/* Check in */}
            <div className="relative">
              <label className="block text-sm font-semibold text-emerald-800 mb-2">Check in</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 h-5 w-5" />
                <input
                  type="text"
                  value={formatDate(checkIn)}
                  onFocus={() => {
                    setShowCheckInCalendar(true);
                    setShowCheckOutCalendar(false);
                    setShowLocationPopupDesktop(false);
                    setShowLocationPopupMobile(false);
                    setShowGuestPopoverDesktop(false);
                    setShowGuestPopoverMobile(false);
                  }}
                  readOnly
                  placeholder="Check-in"
                  className="w-full pl-10 pr-3 py-3 md:py-4 border-2 border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-gray-700 bg-white cursor-pointer hover:border-emerald-500 hover:ring-2 hover:ring-emerald-400"
                />
                {showCheckInCalendar && (
                  <div ref={checkInCalendarRef} className="absolute z-50 top-full left-0 mt-2 w-full">
                    <SingleMonthCalendar
                      value={checkIn}
                      onChange={handleCheckInSelect}
                      minDate={new Date()}
                      onClose={() => setShowCheckInCalendar(false)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Check out */}
            <div className="relative">
              <label className="block text-sm font-semibold text-emerald-800 mb-2">Check out</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 h-5 w-5" />
                <input
                  type="text"
                  value={formatDate(checkOut)}
                  onFocus={() => {
                    if (!checkIn) return;
                    setShowCheckOutCalendar(true);
                    setShowCheckInCalendar(false);
                    setShowLocationPopupDesktop(false);
                    setShowLocationPopupMobile(false);
                    setShowGuestPopoverDesktop(false);
                    setShowGuestPopoverMobile(false);
                  }}
                  readOnly
                  placeholder="Check-out"
                  disabled={!checkIn}
                  className="w-full pl-10 pr-3 py-3 md:py-4 border-2 border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-gray-700 bg-white cursor-pointer hover:border-emerald-500 hover:ring-2 hover:ring-emerald-400"
                />
                {showCheckOutCalendar && (
                  <div ref={checkOutCalendarRef} className="absolute z-[5000] top-full left-0 mt-2 w-auto">
                  <TwoMonthCalendar
                    value={checkOut}
                     onChange={handleCheckOutSelect}
                    minDate={checkIn ? new Date(checkIn.getTime() + 86400000) : new Date()}
                    checkInDate={checkIn}
                    onClose={() => setShowCheckOutCalendar(false)}
                  />
                </div>
              )}
              </div>
            </div>

            <div className="relative" ref={guestPopoverRef}>
              <label className="block text-sm font-semibold text-emerald-800 mb-2">Guests and rooms</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 h-5 w-5" />
                <input
                  type="text"
                  value={formatGuestText()}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Mobile guests input clicked, current state:', showGuestPopoverMobile);
                    setShowGuestPopoverMobile(!showGuestPopoverMobile);
                    setShowLocationPopupDesktop(false);
                    setShowLocationPopupMobile(false);
                    setShowGuestPopoverDesktop(false);
                    setShowCheckInCalendar(false);
                    setShowCheckOutCalendar(false);
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  readOnly
                  className={`w-full pl-10 pr-3 py-3 md:py-4 bg-white border-2 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-gray-800 shadow-lg text-sm ${
                    showGuestPopoverMobile
                      ? 'border-emerald-500 ring-2 ring-emerald-400 bg-emerald-50'
                      : 'border-emerald-400 hover:border-emerald-500 hover:ring-2 hover:ring-emerald-400'
                  }`}
                />
              </div>

              {showGuestPopoverMobile && (
                <div
                  className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-emerald-200 rounded-lg shadow-2xl z-40 p-1 min-w-[120px] max-w-[180px]"
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-gray-800">Select Guests</h3>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowGuestPopoverMobile(false);
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X size={14} className="text-gray-600" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {[
                      { key: 'adults', label: 'Adults', desc: 'Ages 13 or above' },
                      { key: 'children', label: 'Children', desc: 'Ages 2-12' },
                      { key: 'rooms', label: 'Rooms' }
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between py-1 border-b border-gray-100 last:border-b-0">
                        <div>
                          <span className="text-gray-800 font-semibold text-xs">{label}</span>
                          {desc && <p className="text-[10px] text-gray-500">{desc}</p>}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              updateGuestCount(key, -1);
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="w-6 h-6 flex items-center justify-center border-2 border-emerald-500 rounded-lg hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={guests[key] <= (key === 'adults' || key === 'rooms' ? 1 : 0)}
                          >
                            <Minus size={10} className="text-emerald-600" />
                          </button>
                          <span className="w-6 text-center font-bold text-xs text-gray-800">{guests[key]}</span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              updateGuestCount(key, 1);
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="w-6 h-6 flex items-center justify-center border-2 border-emerald-500 rounded-lg hover:bg-emerald-50 transition-colors"
                          >
                            <Plus size={10} className="text-emerald-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleGuestsDone}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="w-full mt-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-1.5 rounded-lg transition-all duration-200 text-xs"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>

         
            <div className="mt-2 md:mt-5 col-span-2">
              <button
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border-2 border-amber-400"
              >
                <Search size={20} />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile + Tablet View (<1024px) */}
      <div className="block md:block lg:hidden">
        <AnimatePresence mode="wait">
          {!showMobileFullSearch ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mobile-search-button absolute left-1/2 top-1/2 mt-[20px] -translate-x-1/2 z-10 w-[90vw] min-w-[220px] max-w-[380px] min-[426px]:max-w-[520px] sm:max-w-[640px] md:max-w-[860px] box-border bg-white rounded-full shadow-lg px-6 py-4 md:px-8 md:py-5 flex items-center gap-6 md:gap-8 border border-emerald-400 cursor-pointer md:static md:mt-6 md:relative md:z-0 md:left-auto md:top-auto md:translate-x-0 md:mx-auto"
              onClick={() => setShowMobileFullSearch(true)}
              style={{boxSizing: 'border-box'}}
            >
              <Search className="text-emerald-600" size={20} />
              <span className="text-sm text-gray-700 flex-1">Where to? | Add dates | Guests</span>
              <button className="ml-auto bg-emerald-600 text-white px-3 py-2 rounded-full">
                <Search size={16} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mobile-search-container"
            >
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl shadow-2xl border-2 border-emerald-200 p-4 mt-4">
                <div className="space-y-4">
                 
                  <div className="relative" ref={locationRef}>
                    <label className="block text-xs font-bold text-emerald-800 mb-1">
                      Where do you want to stay?
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 h-4 w-4" />
                      <input
                        type="text"
                        value={locationMobile}
                        onChange={(e) => setLocationMobile(e.target.value)}
                        onFocus={() => {
                          setShowLocationPopupMobile(true);
                          setShowLocationPopupDesktop(false);
                          setShowGuestPopoverDesktop(false);
                          setShowGuestPopoverMobile(false);
                          setShowCheckInCalendar(false);
                          setShowCheckOutCalendar(false);
                        }}
                        placeholder="Search location, villa"
                        className="w-full pl-10 pr-3 py-3 bg-white border-2 border-emerald-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-gray-800 placeholder-gray-500 shadow-lg text-sm"
                      />
                    </div>
                   
                   {showLocationPopupMobile && (
  <div
   className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-emerald-200 rounded-lg shadow-2xl z-[5000] max-h-[60vh] overflow-y-auto"
   onClick={(e) => e.stopPropagation()}
 >

    {/* ===== Near Me ===== */}
<div
  onClick={() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      console.log("📍 Current location:", latitude, longitude);
      handleSelectLocationMobile({
        city: "Near Me",
        state: `Lat: ${latitude.toFixed(2)}, Lng: ${longitude.toFixed(2)}`
      });
    });
  }}
  className="px-4 py-2 cursor-pointer hover:bg-emerald-50 border-b border-emerald-100 flex items-center gap-2"
>
  <MapPin className="h-4 w-4 text-emerald-600" />
  <span className="text-gray-700 font-medium text-sm">Near Me</span>
</div>

{/* ===== Recent Searches ===== */}
{recentSearches.length > 0 && (
  <div className="mt-2 border-b border-emerald-100">
    <h3 className="text-sm font-semibold text-gray-400 mb-1 ml-4">Recent Searches</h3>
    <ul>
      {recentSearches.map((loc, idx) => (
        <li
          key={idx}
          className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer "
        >
          <div
            className="flex items-center gap-2"
            onClick={() => handleSelectLocationMobile(loc)}
          >
            <MapPin className="h-4 w-4 text-emerald-600 ml-2" />
            <span className="text-gray-700 font-medium text-sm">
              {loc.villaName ? loc.villaName : loc.city}
            </span>
            <span className="text-gray-500 text-xs">{loc.state}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const updated = recentSearches.filter((_, i) => i !== idx);
              setRecentSearches(updated);
              localStorage.setItem("recentSearches", JSON.stringify(updated));
            }}
            className="text-gray-400 hover:text-red-500 "
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  </div>
)}

{/* ===== Filtered Locations ===== */}
{filteredLocationsMobile.length > 0 && (
  <div>
    <div className="px-4 py-2 text-sm text-gray-400 font-semibold">
      Search More
    </div>
    {filteredLocationsMobile.map((loc, idx) => (
      <div
        key={`search-${idx}`}
        onClick={() => handleSelectLocationMobile(loc)}
        className="px-4 py-1 cursor-pointer hover:bg-emerald-50 border-b border-emerald-100 flex justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-600" />
            <span className="text-gray-700 text-sm font-medium">
              {loc.villaName ? `${loc.villaName}` : `${loc.city}, ${loc.state}`}
            </span>
          </div>
          {!loc.villaName && (
            <span className="text-gray-500 text-xs ml-6">{loc.state}</span>
          )}
        </div>
        <span className="text-gray-400 text-sm">
          {loc.villaName ? "Villa" : "City"}
        </span>
      </div>
    ))}
  </div>
)}

  </div>
)}


                  </div>

                  {/* Dates grid: stacked on mobile, side-by-side on tablets */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {/* Check-in */}
                    <div>
                      <label className="block text-xs font-bold text-emerald-800 mb-1">Check-in</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 h-4 w-4" />
                        <input
                          type="text"
                          value={formatDate(checkIn)}
                          onFocus={() => {
                            setShowCheckInCalendar(true);
                            setShowCheckOutCalendar(false);
                            setShowLocationPopupDesktop(false);
                            setShowLocationPopupMobile(false);
                            setShowGuestPopoverDesktop(false);
                            setShowGuestPopoverMobile(false);
                          }}
                          readOnly
                          placeholder="Check-in"
                          className="w-full pl-10 pr-3 py-3 bg-white border-2 border-emerald-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-gray-800 shadow-lg text-sm"
                        />
                      </div>
                      {showCheckInCalendar && (
                        <div className="relative">
                          <div ref={checkInCalendarRef} className="absolute z-50 top-full left-0 mt-2 w-full">
                            <TwoMonthCalendar
                              value={checkIn}
                              onChange={handleCheckInSelect}
                              minDate={new Date()}
                              onClose={() => setShowCheckInCalendar(false)}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Check-out */}
                    <div>
                      <label className="block text-xs font-bold text-emerald-800 mb-1">Check-out</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 h-4 w-4" />
                        <input
                          type="text"
                          value={formatDate(checkOut)}
                          onFocus={() => {
                            if (!checkIn) return; // Prevent opening calendar if no check-in
                            setShowCheckOutCalendar(true);
                            setShowCheckInCalendar(false);
                            setShowLocationPopupDesktop(false);
                            setShowLocationPopupMobile(false);
                            setShowGuestPopoverDesktop(false);
                            setShowGuestPopoverMobile(false);
                          }}
                          readOnly
                          placeholder="Check-out"
                          disabled={!checkIn}
                          className="w-full pl-10 pr-3 py-3 bg-white border-2 border-emerald-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-gray-800 shadow-lg text-sm"
                        />
                      </div>
                      {showCheckOutCalendar && (
                        <div className="relative">
                          <div ref={checkOutCalendarRef} className="absolute z-50 top-full left-0 mt-2 w-full">
                            <TwoMonthCalendar
                              value={checkOut}
                              onChange={handleCheckOutSelect}
                              minDate={checkIn ? new Date(checkIn.getTime() + 86400000) : new Date()}
                              checkInDate={checkIn}
                              onClose={() => setShowCheckOutCalendar(false)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                 
                  <div className="relative">
                    <label className="block text-xs font-bold text-emerald-800 mb-1">Guests & Rooms</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 h-4 w-4" />
                      <input
                        type="text"
                        value={formatGuestText()}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Mobile guests input clicked, current state:', showGuestPopoverMobile);
                          setShowGuestPopoverMobile(!showGuestPopoverMobile);
                          setShowLocationPopupDesktop(false);
                          setShowLocationPopupMobile(false);
                          setShowGuestPopoverDesktop(false);
                          setShowCheckInCalendar(false);
                          setShowCheckOutCalendar(false);
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        readOnly
                        className={`w-full pl-10 pr-3 py-3 bg-white border-2 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-gray-800 shadow-lg text-sm ${
                          showGuestPopoverMobile
                            ? 'border-emerald-500 ring-2 ring-emerald-400 bg-emerald-50'
                            : 'border-emerald-400 hover:border-emerald-500 hover:ring-2 hover:ring-emerald-400'
                        }`}
                      />
                  </div>

                    {showGuestPopoverMobile && (
                      <div
                        className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-emerald-200 rounded-lg shadow-2xl z-40 p-4"
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-base font-bold text-gray-800">Select Guests</h3>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setShowGuestPopoverMobile(false);
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <X size={16} className="text-gray-600" />
                          </button>
                        </div>

                        <div className="space-y-3">
                          {[
                            { key: 'adults', label: 'Adults', desc: 'Ages 13 or above' },
                            { key: 'children', label: 'Children', desc: 'Ages 2-12' },
                            { key: 'rooms', label: 'Rooms' }
                          ].map(({ key, label, desc }) => (
                            <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                              <div>
                                <span className="text-gray-800 font-semibold text-sm">{label}</span>
                                {desc && <p className="text-xs text-gray-500">{desc}</p>}
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    updateGuestCount(key, -1);
                                  }}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  className="w-8 h-8 flex items-center justify-center border-2 border-emerald-500 rounded-lg hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={guests[key] <= (key === 'adults' || key === 'rooms' ? 1 : 0)}
                                >
                                  <Minus size={14} className="text-emerald-600" />
                                </button>
                                <span className="w-8 text-center font-bold text-base text-gray-800">{guests[key]}</span>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    updateGuestCount(key, 1);
                                  }}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  className="w-8 h-8 flex items-center justify-center border-2 border-emerald-500 rounded-lg hover:bg-emerald-50 transition-colors"
                                >
                                  <Plus size={14} className="text-emerald-600" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={handleGuestsDone}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 text-sm"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>

                 
                  <div className="flex gap-3">
                    <button
                      onClick={handleClear}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm border border-gray-400"
                    >
                      <RotateCcw size={16} />
                      Clear
                    </button>
                    <button
                      onClick={handleSearch}
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center justify-center gap-2 text-sm border-2 border-amber-400"
                    >
                      <Search size={18} />
                      Search Hotels
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default SearchForm;