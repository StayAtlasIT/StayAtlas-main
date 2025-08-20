import React, { useState } from "react";
import { Slider, Checkbox, Switch, Select, MenuItem } from "@mui/material";
import { SlidersHorizontal } from "lucide-react";
import { useSwipeable } from "react-swipeable";

const amenitiesListDefault = [
  "WiFi", "Pool", "Air Conditioning", "Kitchen", "Parking", "Gym",
  "TV", "Washing Machine", "Breakfast", "Hot Tub", "Elevator", "Workspace"
];

const FilterSidebar = ({
  isMobile,
  priceRange: priceRangeProp,
  setPriceRange: setPriceRangeProp,
  roomCount: roomCountProp,
  setRoomCount: setRoomCountProp,
  selectedAmenities: selectedAmenitiesProp,
  handleAmenityChange: handleAmenityChangeProp,
  preferences: preferencesProp,
  setPreferences: setPreferencesProp,
  nearby: nearbyProp,
  setNearby: setNearbyProp,
  houseRules: houseRulesProp,
  setHouseRules: setHouseRulesProp,
  roomType: roomTypeProp,
  setRoomType: setRoomTypeProp,
  handleToggle: handleToggleProp,
  amenitiesList: amenitiesListProp
}) => {
  // Use props if provided, otherwise use local state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showMoreAmenities, setShowMoreAmenities] = useState(false);

  const [priceRange, setPriceRange] = useState([5000, 70000]);
  const [roomCount, setRoomCount] = useState(3);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [nearby, setNearby] = useState({});
  const [houseRules, setHouseRules] = useState({});
  const [roomType, setRoomType] = useState("any");
  const amenitiesList = amenitiesListProp || amenitiesListDefault;

  // Use prop or fallback to local state
  const priceRangeVal = priceRangeProp !== undefined ? priceRangeProp : priceRange;
  const setPriceRangeVal = setPriceRangeProp || setPriceRange;
  const roomCountVal = roomCountProp !== undefined ? roomCountProp : roomCount;
  const setRoomCountVal = setRoomCountProp || setRoomCount;
  const selectedAmenitiesVal = selectedAmenitiesProp !== undefined ? selectedAmenitiesProp : selectedAmenities;
  const handleAmenityChangeVal = handleAmenityChangeProp || ((amenity) => setSelectedAmenities((prev) => prev.includes(amenity) ? prev.filter((item) => item !== amenity) : [...prev, amenity]));
  const preferencesVal = preferencesProp !== undefined ? preferencesProp : preferences;
  const setPreferencesVal = setPreferencesProp || setPreferences;
  const nearbyVal = nearbyProp !== undefined ? nearbyProp : nearby;
  const setNearbyVal = setNearbyProp || setNearby;
  const houseRulesVal = houseRulesProp !== undefined ? houseRulesProp : houseRules;
  const setHouseRulesVal = setHouseRulesProp || setHouseRules;
  const roomTypeVal = roomTypeProp !== undefined ? roomTypeProp : roomType;
  const setRoomTypeVal = setRoomTypeProp || setRoomType;
  const handleToggleVal = handleToggleProp || ((stateSetter, key) => stateSetter((prev) => ({ ...prev, [key]: !prev[key] })));

  const handlers = useSwipeable({
    onSwipedLeft: () => setMobileOpen(false),
    delta: 30,
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
  });

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Price Range</h2>
        <Slider value={priceRangeVal} onChange={(e, val) => setPriceRangeVal(val)} valueLabelDisplay="auto" min={5000} max={70000} />
        <div className="text-sm text-gray-600">₹{priceRangeVal[0]} - ₹{priceRangeVal[1]}</div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Amenities</h2>
        {(showMoreAmenities ? amenitiesList : amenitiesList.slice(0, 5)).map((item) => (
          <div key={item} className="flex items-center space-x-2">
            <Checkbox checked={selectedAmenitiesVal.includes(item)} onChange={() => handleAmenityChangeVal(item)} />
            <label>{item}</label>
          </div>
        ))}
        {amenitiesList.length > 5 && (
          <button onClick={() => setShowMoreAmenities((prev) => !prev)} className="text-blue-600 text-sm">
            {showMoreAmenities ? "See Less" : "See More"}
          </button>
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Preferences</h2>
        {["Pet Friendly", "Family Friendly"].map((item) => (
          <div key={item} className="flex justify-between items-center">
            <span>{item}</span>
            <Switch checked={preferencesVal[item] || false} onChange={() => handleToggleVal(setPreferencesVal, item)} />
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Nearby</h2>
        {["Near Railway Station", "Near Airport", "Near Scenic View", "Near Mandir"].map((item) => (
          <div key={item} className="flex justify-between items-center">
            <span>{item}</span>
            <Switch checked={nearbyVal[item] || false} onChange={() => handleToggleVal(setNearbyVal, item)} />
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">House Rules</h2>
        {["Smoking friendly", "Parties", "Pet friendly", "Loud music"].map((item) => (
          <div key={item} className="flex justify-between items-center">
            <span>{item}</span>
            <Switch checked={houseRulesVal[item] || false} onChange={() => handleToggleVal(setHouseRulesVal, item)} />
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Room Type</h2>
        <Select value={roomTypeVal} onChange={(e) => setRoomTypeVal(e.target.value)} fullWidth>
          <MenuItem value="any">Any</MenuItem>
          <MenuItem value="private">Private Room</MenuItem>
          <MenuItem value="entire">Entire Place</MenuItem>
          <MenuItem value="shared">Shared Room</MenuItem>
        </Select>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Number of Rooms</h2>
        <Slider value={roomCountVal} onChange={(e, val) => setRoomCountVal(val)} valueLabelDisplay="auto" min={3} max={12} />
        <div className="text-sm text-gray-600">{roomCountVal} Room(s)</div>
      </div>
      {isMobile && (
        <></>
      )}
      {!isMobile && (
        <></>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        <div className="flex justify-start mb-4">
          <button onClick={() => setMobileOpen(true)} className="flex items-center gap-2 text-sm text-gray-700 px-3 py-2 border border-gray-300 rounded-full hover:bg-gray-100">
            <SlidersHorizontal size={20} />
            <span className="font-bold">Filters</span>
          </button>
        </div>
        <div
          {...handlers}
          className={`fixed left-0 z-50 bg-white p-4 rounded-r-2xl rounded-t-none shadow-lg transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          w-[70vw] h-[calc(100vh-64px)] overflow-y-auto`}
          style={{ top: 80 }}
        >
          <div className="flex justify-end mb-4">
            <button onClick={() => setMobileOpen(false)} className="text-gray-500 hover:text-black text-xl font-bold">
              &times;
            </button>
          </div>
          <FilterContent />
        </div>
      </>
    );
  }
  return <div className="space-y-6">{FilterContent()}</div>;
};

export default FilterSidebar;
