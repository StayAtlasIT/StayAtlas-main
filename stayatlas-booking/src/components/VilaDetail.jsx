import React, { useEffect, useState, useRef } from "react";
import { FaHouse, FaPersonWalkingLuggage } from "react-icons/fa6";
import {
  FaSnowflake,
  FaCar,
  FaFire,
  FaHotjar,
  FaCouch,
  FaUtensils,
  FaTv,
  FaDoorClosed,
  FaChair,
  FaWifi,
  FaSeedling,
  FaBlender,
  FaSwimmingPool,
  FaFan,
  FaTshirt,
} from "react-icons/fa";
import { ChevronLeft, ChevronRight, Loader, LocateIcon, DoorClosed, DotSquareIcon } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import ShowReview from "./ShowReview";
import ReviewForm from "./ReviewForm";
import axios from "../utils/axios";
import { useParams } from "react-router-dom";
import VillaFAQs from "./VillaFAQs";
import VillaRooms from "./VillaRooms";
import PropertyBrochureModal from "./PropertyBrochureModal";
import PropertyVideosModal from "./PropertyVideosModal";
import {
  convertYouTubeLink,
  convertVimeoLink,
  convertDriveLink,
} from "../utils/convertVideoUrl";
import BookingCard from "./BookingCard"; // Import the new component

const amenityIcons = {
  "Air Conditioner": <FaSnowflake className="text-black text-xl" />,
  "Private Parking": <FaCar className="text-black text-xl" />,
  "Barbeque (Chargeable)": <FaFire className="text-black text-xl" />,
  Microwave: <FaHotjar className="text-black text-xl" />,
  Sofa: <FaCouch className="text-black text-xl" />,
  "Dining Table": <FaUtensils className="text-black text-xl" />,
  "Flat Screen Tv": <FaTv className="text-black text-xl" />,
  Wardrobe: <FaDoorClosed className="text-black text-xl" />,
  Refrigerator: <FaSnowflake className="text-black text-xl" />,
  "Outdoor Furniture": <FaChair className="text-black text-xl" />,
  WiFi: <FaWifi className="text-black text-xl" />,
  Garden: <FaSeedling className="text-black text-xl" />,
  "Washing Machine": <FaBlender className="text-black text-xl" />,
  "Swimming Pool": <FaSwimmingPool className="text-black text-xl" />,
  Fan: <FaFan className="text-black text-xl" />,
  "Clothes Rack": <FaTshirt className="text-black text-xl" />,
};

const VilaDetail = ({ property = null }) => {
  const { id } = useParams();
  const realMoments = property?.realMoments || [];
  const [data, setData] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [allReviews, setAllReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [isVideosOpen, setIsVideosOpen] = useState(false);
  const fullAddress = `${property?.villaName}, ${property?.address?.street}, ${property?.address?.city}, ${property?.address?.state}, ${property?.address?.country}, ${property?.address?.zipcode}`;
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const encodedAddress = encodeURIComponent(fullAddress);
  const scrollRef = useRef(null);
  const [brochureUrl, setBrochureUrl] = useState(null);

  // Resolve brochure URL with graceful fallbacks
  useEffect(() => {
    const defaultUrl = import.meta.env.VITE_DEFAULT_BROCHURE_URL || "/StayAtlas T&C Policy.pdf";
    const villaName = property?.villaName || "";
    const encoded = villaName ? encodeURIComponent(villaName) : null;

    const candidates = [
      property?.brochureUrl || null,
      villaName ? `/Brochure/${villaName}.pdf` : null,
      villaName ? `/Brochure/${villaName} By StayAtlas.pdf` : null,
      encoded ? `/Brochure/${encoded}.pdf` : null,
      defaultUrl,
    ].filter(Boolean);

    const check = async (url) => {
      try {
        const res = await fetch(url, { method: "HEAD" });
        return res.ok;
      } catch {
        return false;
      }
    };

    (async () => {
      for (const url of candidates) {
        if (await check(url)) {
          setBrochureUrl(url);
          return;
        }
      }
      setBrochureUrl(defaultUrl);
    })();
  }, [property?.brochureUrl, property?.villaName]);

  // for real moments
  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -250, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 250, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchVilla = async () => {
      try {
        const res = await axios.get(`/villas/${id}`);
        setData({ villa: res.data.data });
      } catch (error) {
        console.error("Failed to fetch villa details", error);
      }
    };
    if (id) {
      fetchVilla();
    }
  }, [id]);

  useEffect(() => {
    const fetchReviewStats = async () => {
      try {
        const res = await axios.get("/reviews/villa-review-stats");
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
    return reviewStats.find((item) => item.villaId === villaId?.toString());
  };

  const fetchReview = async () => {
    try {
      const res = await axios.get(`/reviews/villa/${data?.villa?._id}`);
      setAllReviews(res.data.data);
    } catch (error) {
      console.error("Failed to fetch all reviews", error);
    }
  };

  useEffect(() => {
    if (data?.villa?._id) {
      fetchReview();
    }
  }, [data?.villa?._id]);

  if (property === null) {
    return (
      <div>
        <h1 className="flex justify-center items-center h-screen">
          <Loader className=" font-extrabold size-11 animate-spin" />
        </h1>
      </div>
    );
  }

  return (
    <div className="font-custom min-h-screen flex items-center justify-center bg-[#f8f7f6] text-black p-6">
      <div className="flex flex-col md:flex-row gap-6 w-[95%] mx-auto max-w-[1600px] xl:max-w-7xl">
        <div className="md:w-2/3 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{property.villaName}</h1>
            <p className="text-lg">{`${property?.address?.city}, ${property?.address?.country}`}</p>
          </div>

          <div>
            <p className="text-sm">
              {`${property?.address?.street}, ${property?.address?.city}, ${property?.address?.state}, ${property?.address?.country}, ${property?.address?.zipcode}`}
            </p>

            {(() => {
              if (!data || !data.villa || !data.villa._id) {
                return (
                  <div className="flex mt-1 items-center gap-1 text-gray-400 text-sm font-medium">
                    <span className="text-base font-semibold text-black">0.0</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 fill-current text-yellow-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.572-.955L10 0l2.94 5.955 6.572.955-4.756 4.635 1.122 6.545z" />
                    </svg>
                    <span className="text-gray-400 font-normal">(0 reviews)</span>
                  </div>
                );
              }
              const stats = getReviewStatsForVilla(data.villa._id);
              const averageRating = stats?.averageRating ?? 0.0;
              const reviewCount = stats?.reviewCount ?? 0;
              return (
                <a
                  href="#reviews"
                  className="flex mt-1 items-center gap-1 text-yellow-500 text-sm font-medium cursor-pointer hover:underline"
                >
                  <span className="text-base font-semibold text-yellow-500">
                    {averageRating.toFixed(1)}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 fill-current text-yellow-500"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.572-.955L10 0l2.94 5.955 6.572.955-4.756 4.635 1.122 6.545z" />
                  </svg>
                  <span className="text-gray-500 font-normal">
                    ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                  </span>
                </a>
              );
            })()}
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 border px-3 py-1 rounded-full text-sm">
              <FaHouse /> {property.numberOfRooms} BHK
            </div>
            <div className="flex items-center gap-2 border px-3 py-1 rounded-full text-sm">
              <FaPersonWalkingLuggage /> {property.numberOfRooms * 2} MAX GUEST
            </div>
            <div className="flex items-center gap-2 border px-3 py-1 rounded-full text-sm">
              <DoorClosed /> {property.numberOfRooms} ROOMS
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-14">
            <h2 className="text-2xl font-bold mb-4 border-l-4 border-orange-500 pl-4 text-gray-800">
              Property Description
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line break-words">
              {property.description}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                if (typeof window !== "undefined" && window.innerWidth < 640) {
                  window.open(brochureUrl, "_blank", "noopener,noreferrer");
                } else {
                  setIsBrochureOpen(true);
                }
              }}
              className="border px-2 py-1 rounded-full text-xs transition duration-300 ease-in-out hover:bg-gray-200"
            >
              PROPERTY BROCHURE
            </button>
            <button
              onClick={() => setIsVideosOpen(true)}
              className="border px-2 py-1 rounded-full text-xs transition duration-300 ease-in-out hover:bg-gray-200"
            >
              PROPERTY VIDEOS
            </button>
            <PropertyBrochureModal
              isOpen={isBrochureOpen}
              onClose={() => setIsBrochureOpen(false)}
              pdfUrl={brochureUrl}
              title={`${property?.villaName || "StayAtlas"} Brochure`}
            />
            <PropertyVideosModal
              isOpen={isVideosOpen}
              onClose={() => setIsVideosOpen(false)}
            />
          </div>

          <div className="max-w-4xl mx-auto py-8">
            <h2 className="text-2xl font-bold mb-6 border-l-4 border-orange-500 pl-4">
              Amenities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {property.amenities &&
                property.amenities.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center text-center text-xs"
                  >
                    <div className="text-xl font-black">
                      {amenityIcons[item] || (
                        <DotSquareIcon className="text-black" />
                      )}
                    </div>
                    <div className="mt-1">{item}</div>
                  </div>
                ))}
            </div>
          </div>

          {realMoments?.length > 0 && (
            <div className="max-w-6xl mx-auto py-10 relative">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold border-l-4 border-orange-500 pl-4">
                  Real Moments
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={scrollLeft}
                    className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
                  >
                    <ChevronLeft className="w-5 h-5 text-violet-600" />
                  </button>
                  <button
                    onClick={scrollRight}
                    className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
                  >
                    <ChevronRight className="w-5 h-5 text-violet-600" />
                  </button>
                </div>
              </div>
              <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-4 scrollbar-hide px-1"
              >
                {realMoments.map((moment, index) => (
                  <div
                    key={index}
                    className="min-w-[250px] max-w-[300px] bg-white rounded-lg shadow p-3 flex-shrink-0"
                  >
                    {moment.video?.includes("youtube.com") ||
                    moment.video?.includes("youtu.be") ? (
                      <iframe
                        className="rounded-md w-full h-80"
                        src={convertYouTubeLink(moment.video)}
                        title="YouTube video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : moment.video?.includes("vimeo.com") ? (
                      <iframe
                        className="rounded-md w-full h-80"
                        src={convertVimeoLink(moment.video)}
                        title="Vimeo video"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    ) : moment.video?.includes("drive.google.com") ? (
                      <iframe
                        className="rounded-md w-full h-80"
                        src={convertDriveLink(moment.video)}
                        allow="autoplay"
                        allowFullScreen
                        title="Google Drive video"
                      />
                    ) : (
                      <video
                        controls
                        className="rounded-md w-full h-80 object-cover"
                        src={moment.video}
                      />
                    )}
                    <p className="mt-2 text-sm font-medium text-gray-800">
                      {moment.name}
                    </p>
                    <p className="text-xs text-gray-500">{moment.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="max-w-6xl mx-auto py-8">
            <h2 className="text-2xl font-bold mb-4 border-l-4 border-orange-500 pl-4">
              Location
            </h2>
            <div className="w-full h-[300px] sm:rounded-lg overflow-hidden shadow">
              <iframe
                title="Google Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}`}
              />
            </div>
            <div className="mt-4">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-2 border border-gray-400 rounded-md text-sm text-black hover:bg-gray-200 w-full sm:w-fit"
              >
                <LocateIcon size={16} />
                Get Directions
              </a>
            </div>
          </div>

          <div className="max-w-4xl mx-auto py-8">
            <h2 className="text-2xl font-bold mb-6 border-l-4 border-orange-500 pl-4">
              Rules and Refund Policy
            </h2>
            <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-start md:justify-between py-4 gap-4">
              <div className="w-full md:w-1/3 flex flex-col items-start text-left px-2">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</div>
                <p className="font-semibold text-xs mt-2 leading-tight">
                  100% Future Stay Voucher /<br />
                  100% Refund
                </p>
                <p className="text-[11px] text-gray-600 mt-1">Before 12 days</p>
              </div>
              <div className="hidden md:block w-[1px] h-10 border-l border-dashed border-gray-400"></div>
              <div className="w-full md:w-1/3 flex flex-col items-start text-left px-2">
                <div className="w-6 h-6 bg-yellow-400 text-white rounded-full flex items-center justify-center text-sm font-bold">–</div>
                <p className="font-semibold text-xs mt-2 leading-tight">
                  50% Future Stay Voucher /<br />
                  Refund
                </p>
                <p className="text-[11px] text-gray-600 mt-1">6 to 12 days</p>
              </div>
              <div className="hidden md:block w-[1px] h-10 border-l border-dashed border-gray-400"></div>
              <div className="w-full md:w-1/3 flex flex-col items-start text-left px-2">
                <div className="w-6 h-6 bg-rose-400 text-white rounded-full flex items-center justify-center text-sm font-bold">✕</div>
                <p className="font-semibold text-xs mt-2 leading-tight">No Refund</p>
                <p className="text-[11px] text-gray-600 mt-1">Less than 6 days</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-6 sm:flex-row flex-col">
              <a
                href="/Refund & Cancellation Policy.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="w-full sm:w-auto px-4 py-2 rounded-md bg-gray-100 text-gray-800 shadow-sm hover:bg-gray-200 transition">
                  Refund Policy
                </button>
              </a>
              <a
                href="/StayAtlas T&C Policy.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="w-full sm:w-auto px-4 py-2 rounded-md bg-gray-100 text-gray-800 shadow-sm hover:bg-gray-200 transition">
                  Home Rules and Policy
                </button>
              </a>
            </div>

            <div className="mt-6 text-sm text-gray-700">
              Check-in time: <span className="font-bold">1PM</span> , Check-out
              time: <span className="font-bold">11AM</span>
              <br />
              <span className="text-xs text-gray-500">
                <strong>Note:</strong> Early check-in and late check-out is
                subject to availability (at an additional fee)
              </span>
            </div>
          </div>

          <VillaFAQs />
          <VillaRooms rooms={property.rooms} />

          {allReviews.length > 0 && (
  <div id="reviews" className="max-w-4xl mx-auto mt-6">
    <h2 className="text-2xl font-bold mb-4 border-l-4 border-orange-500 pl-4 text-gray-800">
      Guest Reviews
    </h2>

    <ShowReview reviews={allReviews} />

    <hr className="my-6 border-gray-300" />

    {showReview && (
      <ReviewForm
        villaId={data?.villa?._id}
        onClose={() => setShowReview(false)}
        onReviewSubmitted={async () => {
          const res = await axios.get(`/villas/${id}`);
          setData({ villa: res.data.data });
          fetchReview();
        }}
      />
    )}
  </div>
)}

        </div>

        {/* Use the new BookingCard component here */}
        <BookingCard property={property} />
      </div>
    </div>
  );
};

export default VilaDetail;