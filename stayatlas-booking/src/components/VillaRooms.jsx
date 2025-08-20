// components/VillaRooms.jsx
import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { convertDriveImageLink } from "../utils/convertVideoUrl";

const VillaRooms = ({ rooms = [] }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (!rooms.length) return null; // Don’t render if no rooms

  return (
    <div className="max-w-6xl mx-auto my-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold border-l-4 border-orange-500 pl-4 text-gray-800">
          Rooms & Beds
        </h2>
        <div className="space-x-2 md:flex">
          <button
            onClick={() => scroll("left")}
            className="border border-gray-300 hover:bg-gray-100 rounded-full p-2"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="border border-gray-300 hover:bg-gray-100 rounded-full p-2"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth"
      >
        {rooms.map((room, index) => (
          <div
            key={index}
            className="w-[280px] md:w-[300px] flex-shrink-0 bg-white rounded-xl overflow-hidden shadow-md"
          >
            <div className="relative">
              <img
                src={convertDriveImageLink(room.image)}
                alt={room.name}
                className="w-full h-56 object-cover rounded"
              />

              <div className="absolute top-2 right-2 bg-white text-xs px-3 py-1 rounded-full shadow text-gray-800 font-medium border border-gray-200">
                {room.bedType}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800 mb-2">{room.name}</h3>
              <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
                <li>
                  This room is on the {room.floor} and can accommodate {room.guests}
                </li>
                <li>It is equipped with {room.equipped}</li>
                <li>It has an Ensuite bathroom.The bathroom has a {room.bathroom}</li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VillaRooms;
