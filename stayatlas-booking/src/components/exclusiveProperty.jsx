import React, { useEffect, useRef, useState } from 'react';
import { Heart, Edit2Icon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EditModal from './EditModal';
import axios from '../utils/axios';
import toast from "react-hot-toast";

export default function ExclusiveProperty() {
  const [favorites, setFavorites] = useState({});
  const [visibleCards, setVisibleCards] = useState({});
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cardRefs = useRef({});

  const navigate = useNavigate();

  const handleSave = (updatedHotel) => {
    setHotels((prev) =>
      prev.map((hotel) => (hotel.id === updatedHotel.id ? updatedHotel : hotel))
    );
    setIsModalOpen(false);
  };

  const handleEditClick = (hotel) => {
    setSelectedHotel(hotel);
    setIsModalOpen(true);
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // const viewHandler = (hotel) => {
  //   navigate('/viewExclusive/id', { state: hotel });
  // };

  // Fetch liked villas from backend
  const fetchLikedVillas = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setFavorites({}); // No likes if not logged in
      return;
    }
    try {
      const res = await axios.get('/v1/users/liked-villas', { withCredentials: true });
      if (res.data?.success) {
        const likedVillas = res.data.likedVillas || [];
        setFavorites((prev) => {
          const newFav = { ...prev };
          likedVillas.forEach(id => { newFav[id] = true; });
          return newFav;
        });
      }
    } catch (err) {
      setFavorites({});
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchLikedVillas();
    else setFavorites({});
  }, []);

  // Backend like/unlike
  // NOTE: Viewing exclusive villas is always public. Only liking/favoriting requires login.
  const handleLike = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to like villas", { autoClose: 3000 });
      return;
    }
    try {
      const res = await axios.post(`/v1/reviews/like/${id}`, {}, { withCredentials: true });
      if (res.data?.success) {
        await fetchLikedVillas();
      }
    } catch (err) {
      // Optionally show error
    }
  };

  useEffect(() => {

    async function fetchExclusive() {
      try{
        const {data:{data}} = await axios.get("/v1/villas");
        // const finalData = data.filter((property) => property.isTrending ===true)
        const finalData = data.filter((property) => property.isExclusive ===true)
        console.log(finalData);
        setHotels(finalData);
      }catch(err){
        console.log(err);
      }
    }
    fetchExclusive()
    // setHotels([
    //   {
    //     id: 1,
    //     name: "Silva Heritage, South Goa Pet Pool Villa",
    //     location: "Benaulim, India",
    //     beds: 5,
    //     baths: 5,
    //     guests: 10,
    //     price: 29999,
    //     rating: 5.0,
    //     image: front1,
    //   },
    //   {
    //     id: 2,
    //     name: "15 BHK Hills Estate, Pawna Lake Pet Pool Villa",
    //     location: "Pawna Lake, India",
    //     beds: 15,
    //     baths: 15,
    //     guests: 50,
    //     price: 19999,
    //     rating: 4.7,
    //     image: bedroom,
    //   },
    //   {
    //     id: 3,
    //     name: "Villa Vanessa, North Goa Pet Pool Villa",
    //     location: "Siolim, India",
    //     beds: 5,
    //     baths: 5,
    //     guests: 12,
    //     price: 9999,
    //     rating: 4.7,
    //     image: bedroom2,
    //   },
    // ]);
  }, []);

  // useEffect(() => {
  //   if (!hotels.length) return;

  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           setVisibleCards((prev) => ({
  //             ...prev,
  //             [entry.target.dataset.id]: true,
  //           }));
  //         }
  //       });
  //     },
  //     { threshold: 0.2 }
  //   );

  //   hotels.forEach((hotel) => {
  //     const card = cardRefs.current[hotel.id];
  //     if (card) observer.observe(card);
  //   });

  //   return () => {
  //     hotels.forEach((hotel) => {
  //       const card = cardRefs.current[hotel.id];
  //       if (card) observer.unobserve(card);
  //     });
  //   };
  // }, [hotels]);

  return (
    <div className="bg-white py-16 px-4 sm:px-10 lg:px-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
        Exclusive Luxury Villas & Stays
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 ">
        {hotels.map((property) => (
          <div
            // onClick={() => navigate(`/viewExclusive/${property._id}`)}
            key={property._id}
            data-id={property.id}
            ref={(el) => (cardRefs.current[property.id] = el)}
            className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg p-2"
          >
            <div className=" rounded-2xl">
              <img
                src={property.images[0]}
                alt={property.villaName}
                className="w-full h-60 object-cover rounded-md shadow-md"
              />
              {/* <button
                onClick={() => toggleFavorite(property.id)}
                className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:scale-110 transition"
              >
                <Heart
                  size={22}
                  fill={favorites[property.id] ? "#000" : "none"}
                  color="#000"
                />
              </button> */}
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {property.villaName}
              </h3>
              <p className="text-sm text-gray-600 flex items-center mb-2">
                <svg className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {property.address.city}
              </p>
              {/* <div className="text-sm text-gray-700 mb-3 flex space-x-1">
                {
                  property?.amenities.length > 0 && (
                    property.amenities.map((amenity, index) => (
                      <div >
                        {amenity} {index < property.amenities.length - 1 && "•"}
                      </div>
                    ))
                  )
                }
              </div> */}
              <div className="w-full line-clamp-2 text-sm text-gray-700 mb-3 truncate whitespace-nowrap overflow-hidden">
                {property?.amenities?.join(' • ')}
              </div>
              {/* <div className="text-sm text-gray-700 mb-3">
                {property.beds} Beds • {property.baths} Baths • {property.guests} Guests
              </div> */}

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-base font-semibold text-gray-900">
                    ₹{property.pricePerNight}
                    <span className="text-sm text-gray-500"> /night</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm font-medium">{property.rating}</span>
                  </div>
                  {/* Like button */}
                  <button
                    onClick={() => handleLike(property._id)}
                    className="p-2 rounded-full hover:bg-gray-200"
                    aria-label="Like villa"
                    type="button"
                  >
                    <Heart size={18} fill={favorites[property._id] ? '#e53e3e' : 'none'} color="#e53e3e" />
                  </button>
                  {/* <button onClick={() => handleEditClick(property)} className='p-2 rounded-full hover:bg-gray-200'>
                    <Edit2Icon size={18} />
                  </button> */}
                </div>
              </div>

              <button
                onClick={() => navigate(`/viewExclusive/${property._id}`)}
                className="w-full cursor-pointer mt-6 bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedHotel && (
        <EditModal
          hotelData={selectedHotel}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}