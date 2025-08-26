import React, { useState, useEffect } from 'react';
import PropertyListingGrid from '../components/propertygrid';
import FilterSidebar from '@/components/FilterSidebar';
import SortButton from '@/components/Sort';
import SearchForm from "@/components/SearchForm";
import { useLocation } from "react-router-dom";

const amenitiesList = [
  "WiFi", "Pool", "Air Conditioning", "Kitchen", "Parking", "Gym",
  "TV", "Washing Machine", "Breakfast", "Hot Tub", "Elevator", "Workspace"
];

const Explore = () => {
  // Filter state (local to Explore only)
  const [priceRange, setPriceRange] = useState([5000, 70000]);
  const [roomCount, setRoomCount] = useState(3);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [nearby, setNearby] = useState({});
  const [houseRules, setHouseRules] = useState({});
  const [roomType, setRoomType] = useState("any");
  const [villas, setVillas] = useState([]);
  const [allVillas, setAllVillas] = useState([]); // Store all villas
  const [nights, setNights] = useState(1);
  const location = useLocation();

   // Search state
    const [searchLocation, setSearchLocation] = useState("");
    const [searchCheckIn, setSearchCheckIn] = useState(null);
    const [searchCheckOut, setSearchCheckOut] = useState(null);
    const [searchGuests, setSearchGuests] = useState(1);
    const [searchRooms, setSearchRooms] = useState(1);

    // Handle search parameters from URL
    useEffect(() => {
      const params = new URLSearchParams(location.search);
      
      // Update search state from URL parameters (align with SearchForm: start/end)
      if (params.has("location")) setSearchLocation(params.get("location"));
      if (params.has("start")) setSearchCheckIn(new Date(params.get("start")));
      if (params.has("end")) setSearchCheckOut(new Date(params.get("end")));
      if (params.has("guests")) setSearchGuests(parseInt(params.get("guests")));
      if (params.has("rooms")) {
        setSearchRooms(parseInt(params.get("rooms")));
        setRoomCount(parseInt(params.get("rooms"))); // Update filter state
      }
  
      // Calculate nights if both dates are present
      if (params.has("start") && params.has("end")) {
        const checkIn = new Date(params.get("start"));
        const checkOut = new Date(params.get("end"));
        const nightsDiff = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        setNights(nightsDiff || 1);
      }
    }, [location.search]);
  
    // Handle search from SearchForm
    const handleSearch = (searchData) => {
      setSearchLocation(searchData.location || "");
      setSearchCheckIn(searchData.checkIn ? new Date(searchData.checkIn) : null);
      setSearchCheckOut(searchData.checkOut ? new Date(searchData.checkOut) : null);
      setSearchGuests(searchData.guests || 1);
      setSearchRooms(searchData.rooms || 1);
      
      // Update room count in filters
      if (searchData.rooms) setRoomCount(searchData.rooms);
      
      // Calculate nights
      if (searchData.checkIn && searchData.checkOut) {
        const nightsDiff = Math.ceil((new Date(searchData.checkOut) - new Date(searchData.checkIn)) / (1000 * 60 * 60 * 24));
        setNights(nightsDiff || 1);
      }
    };
  
    // Apply search filters to all villas
    useEffect(() => {
      const applySearchFilters = () => {
        let filtered = [...allVillas];
  
        // Filter by location or villa name
        if (searchLocation?.trim()) {
          const needle = searchLocation.toLowerCase();
          filtered = filtered.filter(villa => {
            const haystack = [
              villa.name,
              villa.villaName,
              villa.address?.city,
              villa.address?.state,
              villa.address?.fullAddress
            ].filter(Boolean).join(' ').toLowerCase();
            return haystack.includes(needle);
          });
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

  return (
    <div className="min-h-screen bg-gray-50">

            {/* Search Bar (no sticky, lower z-index) */}
            <div className="relative md:-mt-10">
              <SearchForm onSearch={handleSearch} />
            </div>
  
      <div className="max-w-[1700px] mx-auto">
        <div className="lg:hidden p-4">
          <div className="mt-8 mb-8">
          <FilterSidebar isMobile={true} {...filterProps} />
          </div>
          <div className="mt-4">
            {/* <div className="flex justify-between border-b text-sm font-medium text-gray-700">
              <button className="pb-2 border-b-2 border-black">All</button>
              <button className="pb-2">Trending</button>
              <button className="pb-2">Price: High to Low</button>
              <button className="pb-2">Newly Launched</button>
            </div> */}
          </div>
          <div className="mt-4">
            <PropertyListingGrid
              priceRange={priceRange}
              roomCount={roomCount}
              selectedAmenities={selectedAmenities}
              preferences={preferences}
              nearby={nearby}
              houseRules={houseRules}
              roomType={roomType}
            />
          </div>
        </div>
        <div className="hidden lg:flex p-0 gap-0">
          <div className="w-80 xl:w-96 flex-shrink-0 ml-4">
            <div className="sticky top-20 mt-8 mb-8">
              <div className="p-6 border border-gray-300 rounded-lg max-h-[calc(100vh-120px)] overflow-y-auto bg-white shadow-lg">
              <FilterSidebar isMobile={false} {...filterProps} />
              </div>
            </div>
          </div>
          <div className="flex-1 p-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 pl-4">Explore Villas</h1>
                <p className="text-gray-600 text-base pl-4">
                  Discover amazing places to stay for your next getaway
                </p>
              </div>
              <SortButton />
            </div>
            <PropertyListingGrid
              priceRange={priceRange}
              roomCount={roomCount}
              selectedAmenities={selectedAmenities}
              preferences={preferences}
              nearby={nearby}
              houseRules={houseRules}
              roomType={roomType}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
