import React, { useState, useEffect } from "react";
import FilterSidebar from "@/components/FilterSidebar";
import ExclusivePropertyCard from "@/components/ExclusivePropertyCard";
import SearchForm from "@/components/SearchForm";
import axios from "axios";
import { useLocation } from "react-router-dom";

const amenitiesList = [
  "WiFi", "Pool", "Air Conditioning", "Kitchen", "Parking", "Gym",
  "TV", "Washing Machine", "Breakfast", "Hot Tub", "Elevator", "Workspace"
];

const filterVillas = (villas, {
  priceRange,
  roomCount,
  selectedAmenities,
  preferences,
  nearby,
  houseRules,
  roomType
}) => {
  return villas.filter((property) => {
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
};

const Exclusive = () => {
  const [villas, setVillas] = useState([]);
  const [allVillas, setAllVillas] = useState([]); // Store all villas
  const [nights, setNights] = useState(1);
  const location = useLocation();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter state
  const [priceRange, setPriceRange] = useState([5000, 70000]);
  const [roomCount, setRoomCount] = useState(3);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [nearby, setNearby] = useState({});
  const [houseRules, setHouseRules] = useState({});
  const [roomType, setRoomType] = useState("any");

  // Search state
  const [searchLocation, setSearchLocation] = useState("");
  const [searchCheckIn, setSearchCheckIn] = useState(null);
  const [searchCheckOut, setSearchCheckOut] = useState(null);
  const [searchGuests, setSearchGuests] = useState(1);
  const [searchRooms, setSearchRooms] = useState(1);

  // Fetch all exclusive villas once on component mount
  useEffect(() => {
    const fetchAllExclusiveVillas = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/villas/get-exclusive-villa");
        setAllVillas(res.data.data);
      } catch (err) {
        console.error("Failed to fetch exclusive villas:", err.message);
      }
    };

    fetchAllExclusiveVillas();
  }, []);

  // Handle search parameters from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Update search state from URL parameters
    if (params.has("location")) setSearchLocation(params.get("location"));
    if (params.has("checkIn")) setSearchCheckIn(new Date(params.get("checkIn")));
    if (params.has("checkOut")) setSearchCheckOut(new Date(params.get("checkOut")));
    if (params.has("guests")) setSearchGuests(parseInt(params.get("guests")));
    if (params.has("rooms")) {
      setSearchRooms(parseInt(params.get("rooms")));
      setRoomCount(parseInt(params.get("rooms"))); // Update filter state
    }

    // Calculate nights if both dates are present
    if (params.has("checkIn") && params.has("checkOut")) {
      const checkIn = new Date(params.get("checkIn"));
      const checkOut = new Date(params.get("checkOut"));
      const nightsDiff = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      setNights(nightsDiff || 1);
    }
  }, [location.search]);

  // Handle search from SearchForm
  const handleSearch = (searchData) => {
    setSearchLocation(searchData.location || "");
    setSearchCheckIn(searchData.checkIn || null);
    setSearchCheckOut(searchData.checkOut || null);
    setSearchGuests(searchData.guests || 1);
    setSearchRooms(searchData.rooms || 1);
    
    // Update room count in filters
    if (searchData.rooms) setRoomCount(searchData.rooms);
    
    // Calculate nights
    if (searchData.checkIn && searchData.checkOut) {
      const nightsDiff = Math.ceil((searchData.checkOut - searchData.checkIn) / (1000 * 60 * 60 * 24));
      setNights(nightsDiff || 1);
    }
  };

  // Apply search filters to all villas
  useEffect(() => {
    const applySearchFilters = () => {
      let filtered = [...allVillas];

      // Filter by location (city)
      if (searchLocation?.trim()) {
        filtered = filtered.filter(villa => 
          villa.address?.city?.toLowerCase().includes(searchLocation.toLowerCase())
        );
      }

      // Filter by number of rooms
      if (searchRooms > 1) {
        filtered = filtered.filter(villa => 
          villa.numberOfRooms >= searchRooms
        );
      }

      // Filter by guest capacity (if available)
      if (searchGuests > 1) {
        filtered = filtered.filter(villa => {
          // If villa has guestCapacity field, use it
          if (villa.guestCapacity) {
            return villa.guestCapacity >= searchGuests;
          }
          // Otherwise, estimate based on number of rooms (rough estimate)
          return villa.numberOfRooms >= Math.ceil(searchGuests / 2);
        });
      }

      // Filter by availability dates (if checkIn and checkOut are provided)
      if (searchCheckIn && searchCheckOut) {
        filtered = filtered.filter(villa => {
          // Check if villa has availability data
          if (villa.availability && villa.availability.length > 0) {
            return villa.availability.some(period => 
              period.isAvailable && 
              new Date(period.start) <= searchCheckIn && 
              new Date(period.end) >= searchCheckOut
            );
          }
          // If no availability data, assume villa is available
          return true;
        });
      }

      setVillas(filtered);
    };

    applySearchFilters();
  }, [allVillas, searchLocation, searchCheckIn, searchCheckOut, searchGuests, searchRooms]);

  // Handlers
  const handleAmenityChange = (amenity) =>
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  const handleToggle = (stateSetter, key) =>
    stateSetter((prev) => ({ ...prev, [key]: !prev[key] }));

  // Props for FilterSidebar
  const filterProps = {
    priceRange, setPriceRange,
    roomCount, setRoomCount,
    selectedAmenities, handleAmenityChange,
    preferences, setPreferences,
    nearby, setNearby,
    houseRules, setHouseRules,
    roomType, setRoomType,
    handleToggle,
    amenitiesList
  };

  // Filter villas before rendering
  const filteredVillas = filterVillas(villas, {
    priceRange,
    roomCount,
    selectedAmenities,
    preferences,
    nearby,
    houseRules,
    roomType
  });

  return (
    <div>
      {/* Search Bar (no sticky, lower z-index) */}
      <div className="relative md:-mt-10">
        <SearchForm onSearch={handleSearch} />
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden p-4">
        <FilterSidebar isMobile={true} {...filterProps} />
        <div className="mt-4">
          {filteredVillas.length === 0 ? (
            <p className="text-center text-gray-500 text-lg mt-10">
              No villas found. Please search again.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredVillas.map((villa, index) => (
                <ExclusivePropertyCard
                  key={villa._id || villa.id || `villa-${index}`}
                  villa={villa}
                  nights={nights}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex max-w-[1700px] mx-auto mt-6 px-10 gap-4">
        {/* Left: FilterSidebar */}
        <div className="w-1/4 flex-shrink-0">
          <div className="sticky top-20 p-6 border border-gray-300 rounded-lg">
            <FilterSidebar isMobile={false} {...filterProps} />
          </div>
        </div>

        {/* Right: Villa Cards */}
        <div className="w-3/4">
          {filteredVillas.length === 0 ? (
            <p className="text-center text-gray-500 text-lg mt-10">
              No villas found. Please search again.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredVillas.map((villa, index) => (
                <ExclusivePropertyCard
                  key={villa._id || villa.id || `villa-${index}`}
                  villa={villa}
                  nights={nights}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exclusive;
