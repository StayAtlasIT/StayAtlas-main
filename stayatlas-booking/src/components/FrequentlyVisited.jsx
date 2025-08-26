import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Star, Users, Bed, Bath, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const VillaCard = ({ property}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reviewStats, setReviewStats] = useState([]);

  const handleNavigation = () => {
    navigate(`/booking/${property.id}`);
    window.scrollTo(0, 0);
  };

    // review
  useEffect(() => {
    const fetchReviewStats = async () => {
      try {
        const res = await axios.get("/v1/reviews/villa-review-stats");
        // console.log("API DATA:", res.data.data);
        setReviewStats(res.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch review stats", error);
        setLoading(false);
      }
    };

    fetchReviewStats();
  }, []);

    const getReviewStatsForVilla = (villaId) => {
    return reviewStats.find((item) => item.villaId === villaId);
  };


  return (
    <div 
      onClick={handleNavigation}
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 flex-shrink-0 cursor-pointer" 
      style={{
        width: '320px',
        height: '360px',
        flex: '0 0 320px'
      }}>
      <div className="relative overflow-hidden h-[180px]">
        <img 
          src={property.images[0]} 
          alt={property.villaName} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {(() => {
  const stats = getReviewStatsForVilla(property._id); // Replace with correct ID if different
  const averageRating = stats?.averageRating ?? 0.0;

  return (
    <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 flex items-center shadow-sm">
      <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
      <span className="font-semibold text-xs">{averageRating.toFixed(1)}</span>
    </div>
  );
})()}

        <div className="absolute top-2 right-2 bg-black/85 backdrop-blur-sm text-white rounded-full px-2 py-1">
          <span className="font-bold text-xs">₹{property.pricePerNight}</span>
        </div>
      </div>

      <div className="p-3 space-y-2 flex flex-col h-[180px]">
        <div>
          <h3 className="font-bold text-sm mb-1 text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {property.villaName}
          </h3>
     
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="h-3 w-3 mr-1 text-gray-400" />
            <span className="text-xs font-medium">{property.address.city}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 rounded-lg p-2">
          <div className="flex items-center">
            <Users className="h-3 w-3 mr-1" />
              <span>Upto {property.guestCapacity || (property.numberOfRooms * 2) || 0} Guests</span>
          </div> 
          <div className="flex items-center">
            <Bed className="h-3 w-3 mr-1" />
            <span>{property.numberOfRooms || '0'}</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-3 w-3 mr-1" />
            <span>{property.numberOfBathrooms || '0'}</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-600 line-clamp-1 leading-relaxed">
          {property?.amenities?.slice(0, 3).join(' • ')}
          {property?.amenities?.length > 3 && ' • ...'}
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <div className="flex items-baseline">
              <span className="font-bold text-lg text-gray-900">₹{property.pricePerNight}</span>
              <span className="text-gray-500 text-xs ml-1">/night</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-1.5 px-3 rounded-lg shadow-sm text-xs">
            Book Now
          </div>
        </div>
      </div>
    </div>
  );
};

const EnhancedVillaCards = () => {
  const scrollRef = useRef(null);

  const [villaData, setVillaData] = useState([]);

  useEffect(() => {
    const fetchVillaData = async () => {
      try {
        const response = await axios.get('/v1/villas/recently-viewed');
        setVillaData(response.data.data); 
      } catch (error) {
        console.error('Failed to fetch villas:', error);
      }
    };

    fetchVillaData();
  }, []); 
  console.log(villaData)
  const sampleProperties = villaData

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!villaData || villaData.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Recently Viewed Properties</h2>
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
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            maxWidth: '100%',
            minWidth: '0',
          }}
        >
          {sampleProperties.map((property) => 
            property && property._id ? (
            <VillaCard 
              key={property._id} 
              property={property} 
            />
            ) : null
          )}
        </div>
      </div>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .villa-card-fixed {
          width: 300px;
          min-width: 300px;
          max-width: 300px;
        }
      `}</style>
    </div>
  );
};

export default EnhancedVillaCards;