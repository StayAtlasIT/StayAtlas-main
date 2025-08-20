import React, { useEffect, useRef, useState } from "react";
import UseExclusive from "./useVIllas";
import axios from "axios";
import { ChevronLeft, ChevronRight } from 'lucide-react';


const HorizontalVillas = () => {
  const [villas, setVillas] = useState([]);
  const [nights, setNights] = useState(1);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchVillas = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/villas/get-exclusive-villa");
        setVillas(res.data.data); // ✅ set state here
      } catch (err) {
        console.error("Failed to fetch exclusive villa:", err.message);
      }
    };

    fetchVillas();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-white py-6">
      {villas.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-10">No villas found.</p>
      ) : (
         <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-0">
          <div className="flex items-center justify-between mb-6">
  <h2 className="font-bold text-gray-900 whitespace-nowrap 
               text-2xl sm:text-3xl md:text-4xl">
  Trending Properties
</h2>
  <div className="flex gap-2">
    <button
      onClick={() => scroll('left')}
      className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:bg-gray-50"
    >
      <ChevronLeft className="h-5 w-5 text-gray-600" />
    </button>
    <button
      onClick={() => scroll('right')}
      className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:bg-gray-50"
    >
      <ChevronRight className="h-5 w-5 text-gray-600" />
    </button>
  </div>
</div>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {villas.map((villa, index) => (
              <div key={villa._id || villa.id || `villa-${index}`} className="flex-shrink-0">
                <UseExclusive villa={villa} nights={nights} />
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default HorizontalVillas;
