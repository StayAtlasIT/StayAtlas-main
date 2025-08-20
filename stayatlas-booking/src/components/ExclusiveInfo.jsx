import React, { useState, useEffect } from "react";
import axios from "../utils/axios"
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const ExclusiveInfo = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [mouseStart, setMouseStart] = useState(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const navigate = useNavigate()
    const [property,setProperty] = useState(null)
    const {id} = useParams()

 
    // Auto slide functionality
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex(prevIndex => 
                prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000); // Change image every 5 seconds
        
        return () => clearInterval(interval);
    }, [property?.images.length]);

    // Touch event handlers for swipe
    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const minSwipeDistance = 50;
        
        if (distance > minSwipeDistance) {
            // Swiped left, show next image
            setCurrentImageIndex(prevIndex => 
                prevIndex === property.image.length - 1 ? 0 : prevIndex + 1
            );
        } else if (distance < -minSwipeDistance) {
            // Swiped right, show previous image
            setCurrentImageIndex(prevIndex => 
                prevIndex === 0 ? property.image.length - 1 : prevIndex - 1
            );
        }
    };

    // Mouse event handlers for swipe
    const onMouseDown = (e) => {
        setIsMouseDown(true);
        setMouseStart(e.clientX);
    };

    const onMouseMove = () => {
        if (!isMouseDown) return;
    };

    const onMouseUp = (e) => {
        if (!isMouseDown || !mouseStart) return;
        
        const distance = mouseStart - e.clientX;
        const minSwipeDistance = 50;
        
        if (distance > minSwipeDistance) {
            // Swiped left, show next image
            setCurrentImageIndex(prevIndex => 
                prevIndex === property.image.length - 1 ? 0 : prevIndex + 1
            );
        } else if (distance < -minSwipeDistance) {
            // Swiped right, show previous image
            setCurrentImageIndex(prevIndex => 
                prevIndex === 0 ? property.image.length - 1 : prevIndex - 1
            );
        }
        
        setIsMouseDown(false);
    };

    const onMouseLeave = () => {
        setIsMouseDown(false);
    };

    useEffect(() => {
      async function fetchExcluisve(){
        try{
          const {data} = await axios.get(`/v1/villas/${id}`)
          
          if(data.statusCode!==200){
            toast.error("No Exclusive Villa Data Found")
          }else{
            setProperty(data.data)
          }
        }catch(error){
          console.error("Error fetching exclusive data:", error);
        }
      }
      fetchExcluisve()
    },[])

    if(property==null){
      return <div>
        <h1 className="text-2xl font-bold text-center mt-10"><Loader className="animate-spin"/>Loading...</h1>
      </div>
    }

    // console.log(property)

  return (
    <>
      <div className="w-vw bg-[#F5F5F5] h-225 md:h-215">
        <div className="absolute h-full bg-[#F5F5F5] md:bg-transparent w-full flex justify-center items-center">
        <div className="absolute h-full bg-[#F5F5F5] md:bg-transparent w-full flex justify-center items-center">
            <div className="backdrop-blur-[17px] h-auto w-90 ">
              <div className=" p-2"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
              >
                { <img src={property.images[currentImageIndex]} alt="" className="h-72 overflow-hidden w-full mt-40 md:mt-0" /> }
              </div>
                <div className="p-6 ">
                  <h3 className="text-lg font-semibold text-gray-900 p-4">
                    {property.villaName}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center mb-2">
                    <svg className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {property.address.city}
                  </p>

                  {/* <div className="text-sm text-gray-700 mb-3">
                    {property.beds} Beds • {property.baths} Baths • {property.guests} Guests
                  </div> */}
                  {/* <div className="text-sm text-gray-700 mb-3 flex space-x-1">
                    {
                      property?.amenities.length > 0 && (
                        property.amenities.map((amenity, index) => (
                          <div >
                            {(index > 3) ? "" : `${amenity} `} {index < 3 && "•"}
                          </div>
                        ))
                      )
                    }
                  </div> */}
                  <div className="w-full line-clamp-2 text-sm text-gray-700 mb-3 ">
                    {property?.amenities?.join(' • ')}
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-base font-semibold text-gray-900">
                        ₹{property.pricePerNight}
                        <span className="text-sm text-gray-500"> /night</span>
                      </p>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-sm font-medium">{property.rating}</span>
                    </div>
                  </div>
                  <div className="h-50 md:h-0 pt-5 overflow-auto md:overflow-hidden w-full">
                    {property.description}
                  </div>

                  <button onClick={() => navigate(`/booking/${id}`)} className="w-full mt-6 cursor-pointer bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-70 transition">
                    Book Now
                  </button>
                </div>
            </div>
        </div>
        <div  className="h-0 md:h-full p-0 m-0 flex object-cover ">
        <div className=" w-0 md:w-[50%]  overflow-hidden md:overflow-visible pl-15 pr-0 md:pr-50 py-15 bg-gray-100">
        <div className="font-custom  text-slate-600 space-y-3 h-full w-full">
          {/* Property Name */}
          <h1 className="text-4xl font-bold leading-snug text-slate-700">{property.villaName}</h1>

          {/* Location */}
          <div className="flex items-center text-slate-700 font-semibold text-4xl py-2">
            <svg
              className="h-5 w-5 mr-2 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{property.address.city}</span>
          </div>

          {/* Bed/Bath/Guest Info
          <div className="text-2xl text-slate-700 font-semibold py-2">
            {property.beds} Beds &bull; {property.baths} Baths &bull; {property.guests} Guests
          </div> */}
          {/* <div className="text-lg text-gray-700 mb-3 flex space-x-1">
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
          <div className="w-full line-clamp-2 text-sm text-gray-700 mb-3">
            {property?.amenities?.join(' • ')}
          </div>

          {/* Price */}
          <div className="text-xl font-semibold text-slate-800 py-2">
            ₹{property.pricePerNight}
            <span className="text-sm font-normal text-gray-500"> / night</span>
          </div>
          <div className="text-2xl font-semibold text-slate-800">
            Description
          </div>
          <div className="text-xl overflow-auto w-full h-[50%]">
            {property.description}
          </div>

          </div>
          </div>
            <div className="p-0 m-0 w-full md:w-1/2 h-[300px] md:h-full object-cover"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseLeave}
            >
              <img src={property.images[currentImageIndex]} className="w-full h-full object-cover" alt="" />
            </div>
        </div>
        </div>   
      </div>     
    </>
  )
}


export default ExclusiveInfo