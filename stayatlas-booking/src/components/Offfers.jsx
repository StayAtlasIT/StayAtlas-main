import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import {
  FaCopy,
  FaCheck,
  FaPlane,
  FaWallet,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const ICONS_MAP = {
  plane: <FaPlane />,
  wallet: <FaWallet />,
  location: <FaMapMarkerAlt />,
  calendar: <FaCalendarAlt />,
};

const OffersSection = () => {
  const [offers, setOffers] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const scrollRef = useRef(null);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const { data } = await axios.get("/v1/offers");
        setOffers(data.data);
      } catch (err) {
        console.error("Error fetching offers:", err);
      }
    }
    fetchOffers();
  }, []);

  const filteredOffers =
    activeTab === "all" ? offers : offers.filter((o) => o.type === activeTab);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const scrollLeft = () => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({ left: -350, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({ left: 350, behavior: "smooth" });
  };

  const renderOfferCard = (offer) => (
    <div
      key={offer._id}
      className={`w-[320px] h-[290px] bg-gradient-to-br ${offer.gradient} rounded-2xl p-6 text-white flex flex-col justify-between relative transition-transform hover:scale-[1.03] shadow-lg mr-4 flex-shrink-0`}
    >
      <div>
        <div className="absolute top-0 right-0 w-28 h-28 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-white rounded-full transform translate-x-8 -translate-y-8" />
        </div>
        <div className="flex items-center mb-4 z-10">
          <div className="p-2 bg-white bg-opacity-20 rounded-lg mr-3">
            {ICONS_MAP[offer.icon] || <FaPlane />}
          </div>
          <div>
            <h3 className="text-lg font-bold">{offer.title}</h3>
            <p className="text-sm opacity-90">{offer.subtitle}</p>
          </div>
        </div>
        <div className="absolute top-4 right-4 bg-black bg-opacity-70 backdrop-blur-md rounded-full px-3 py-1 text-sm font-bold z-10">
          {offer.discount}
        </div>
        <p className="text-sm opacity-90 mb-2 z-10">{offer.description}</p>
        <p className="text-xs opacity-75 mb-2 z-10">
          Valid Till: {new Date(offer.validTill).toLocaleDateString()}
        </p>
      </div>

      <div className="z-10">
        <div className="bg-black bg-opacity-80 rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm font-mono font-bold tracking-wider border-2 border-dashed border-white px-3 py-1 rounded">
            {offer.code}
          </span>
          <button
            onClick={() => copyToClipboard(offer.code)}
            className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
          >
            {copiedCode === offer.code ? (
              <>
                <FaCheck className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <FaCopy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-12 bg-gradient-to-br from-gray-50 to-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
  <h2 className="font-bold text-gray-900 whitespace-nowrap text-[30px] md:text-[28px]">
    Offers for You
  </h2>
  <p className="text-gray-600">
    Grab these exclusive Stay Atlas deals before they expire!
  </p>
</div>

        <div className="flex justify-between items-center mb-4 gap-2 flex-wrap md:flex-nowrap">
          <div className="flex-1 overflow-x-auto">
            <div className="flex space-x-2 bg-white rounded-lg p-1 shadow-sm border text-sm font-medium w-max">
              {["all", "wallet", "stay"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 whitespace-nowrap rounded-md transition ${
                    activeTab === tab
                      ? "bg-blue-500 text-white shadow"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {tab === "all"
                    ? "All"
                    : tab === "wallet"
                    ? "Wallet Offers"
                    : "Stay Atlas Deals"}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:flex space-x-2 shrink-0">
            <button
              onClick={scrollLeft}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={scrollRight}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar scroll-smooth space-x-4 pr-2"
        >
          {filteredOffers.map(renderOfferCard)}
        </div>
      </div>
    </div>
  );
};

export default OffersSection;

// {
//       id: 3,
//       title: "ATLASLOCAL",
//       subtitle: "Local Explorer Deal",
//       description:
//         "Residents get 15% OFF on short stays within their home state. Rediscover your backyard!",
//       validTill: "30 Sep 2025",
//       code: "ATLASLOCAL",
//       discount: "15% OFF",
//       type: "stay",
//       gradient: "from-indigo-500 to-indigo-700",
//       icon: <FaMapMarkerAlt />,
//     },
