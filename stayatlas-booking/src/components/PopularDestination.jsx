import React, { useState, useEffect } from 'react';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import axios from "axios";

const DestinationCard = ({ destination, isHovered, onHover, onLeave, isMobile, isTablet }) => {
  const isActive = isHovered === destination._id;
  const isInactive = isHovered !== null && isHovered !== destination._id;

  // Responsive height
  const getCardHeight = () => {
    if (isMobile) return '320px';
    if (isTablet) return '360px';
    return '420px';
  };

  // Responsive flex grow
  const getFlexValue = () => {
    if (isMobile) return '1';
    if (isTablet) return isActive ? '1.5' : isInactive ? '0.8' : '1';
    return isActive ? '2' : isInactive ? '0.7' : '1';
  };

  // Font sizes dynamic
  const getFontSizes = () => {
    if (isMobile) {
      return { title: isActive ? '20px' : '18px', description: isActive ? '14px' : '12px' };
    }
    if (isTablet) {
      return { title: isActive ? '24px' : '18px', description: isActive ? '15px' : '12px' };
    }
    return { title: isActive ? '28px' : '20px', description: isActive ? '16px' : '14px' };
  };

  const cardStyle = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: isMobile ? '24px' : '32px',
    cursor: 'pointer',
    height: getCardHeight(),
    transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    flex: getFlexValue(),
    transform: isActive && !isMobile ? 'scale(1.02) translateY(-4px)' : 'scale(1)',
    opacity: isInactive ? '0.85' : '1',
    boxShadow: isActive ? 'none' : '0 8px 24px rgba(0,0,0,0.08)',
    backgroundImage: `url(${destination.image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minWidth: isMobile ? '100%' : isTablet ? '220px' : '280px',
    marginBottom: isMobile ? '16px' : '0',
    border: '1px solid rgba(255,255,255,0.1)'
  };

  const overlayStyle = {
    position: 'absolute',
    inset: '0',
    borderRadius: 'inherit',
    background: isActive
      ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.65) 100%)'
      : 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.4) 100%)',
    transition: 'all 0.8s cubic-bezier(0.25,0.46,0.45,0.94)'
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 10,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: '24px',
    color: 'white'
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => onHover(destination._id)}
      onMouseLeave={onLeave}
      onClick={() => (window.location.href = `/booking/${destination._id}`)}
    >
      <div style={overlayStyle} />

      {/* Content */}
      <div style={contentStyle}>
        {/* Rating */}
        <div className="absolute top-5 right-5 px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold"
             style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(12px)' }}>
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          {destination.rating}
        </div>

        <div className="flex items-center gap-2 mb-2 opacity-90">
          <MapPin className="w-3 h-3" />
          <span className="text-sm">{destination.location}</span>
        </div>

        <h3 className="font-bold mb-2" style={{ fontSize: getFontSizes().title }}>
          {destination.name}
        </h3>

        <p className="mb-3 opacity-90" style={{ fontSize: getFontSizes().description }}>
          {destination.description
            ?.split(" ")
            .slice(0, 13)
            .join(" ") + (destination.description?.split(" ").length > 15 ? "..." : "")}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {destination.amenities?.slice(0, 3).map((a, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs"
              style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}
            >
              {a}
            </span>
          ))}

          {destination.amenities?.length > 3 && (
            <span
              className="px-3 py-1 rounded-full text-xs"
              style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}
            >
              +{destination.amenities.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold">{destination.price}</div>
          <div className="w-11 h-11 flex items-center justify-center rounded-full border cursor-pointer"
               style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(12px)' }}
               onClick={() => (window.location.href = `/booking/${destination._id}`)}>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

const DestinationCards = () => {
  const [popularVillas, setPopularVillas] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const fetchVillas = async () => {
      try {
        const res = await axios.get("/v1/villas/get-exclusive-villa");
        let villas = res.data.data || [];

        let mapped = villas.map(v => ({
          _id: v._id,
          name: v.villaName || "Unknown Villa",
          description: v.description || "Experience luxury stay",
          image: v.images?.[0] || "/fallback.jpg",
          location: `${v?.address?.city || ""}, ${v?.address?.state || ""}`,
          price: v.pricePerNight ? `₹${v.pricePerNight}` : "₹N/A",
          amenities: v.amenities || [],
          rating: v.rating || 0
        }));

        const allZero = mapped.every(v => v.rating === 0);
        mapped = allZero
          ? mapped.sort(() => 0.5 - Math.random()).slice(0, 3)
          : mapped.sort((a, b) => b.rating - a.rating).slice(0, 3);

        setPopularVillas(mapped);
      } catch (err) {
        console.error("Failed to fetch villas:", err.message);
      }
    };

    fetchVillas();

    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full shadow-lg mb-6">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <h2 
            className="font-bold text-gray-900 mb-6"
            style={{
              fontSize: isMobile ? "24px" : isTablet ? "36px" : "48px",
              whiteSpace: isMobile ? "nowrap" : "normal",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            Popular Destinations
          </h2>
          <p
            className="text-gray-600 max-w-3xl mx-auto leading-relaxed"
            style={{ fontSize: isMobile ? "14px" : "18px" }}
          >
            Explore our most sought-after locations, each offering unique experiences and unforgettable memories
          </p>
        </div>

        {/* Villas */}
        {popularVillas.length === 0 ? (
          <p className="text-center text-gray-500">No popular villas found.</p>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
            {popularVillas.map((villa) => (
              <DestinationCard
                key={villa._id}
                destination={villa}
                isHovered={hoveredId}
                onHover={setHoveredId}
                onLeave={() => setHoveredId(null)}
                isMobile={isMobile}
                isTablet={isTablet}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
};

export default DestinationCards;
