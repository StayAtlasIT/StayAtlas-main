import React, { useEffect,useState } from 'react'
import VillaHeader from '../components/VillaHeader'
import VillaDetails from '../components/VilaDetail'
import Gallery from "../components/Gallery"
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from "../utils/axios"
import { Loader } from 'lucide-react'

const Booking = () => {
  const {id} = useParams();
  // console.log(id)
  const [property, setProperty] = React.useState(null)
  const [error, setError]     = React.useState(false)
  const [reviewStats, setReviewStats] = useState([]);
  const [loading, setLoading] = useState(true);


  const getReviewStatsForVilla = (villaId) => {
  return reviewStats.find((item) => item.villaId === villaId);
};

 useEffect(() => {
  const fetchReviewStats = async () => {
    try {
      const res = await axios.get("/v1/reviews/villa-review-stats");
      setReviewStats(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch review stats", error);
    } finally {
      setLoading(false);
    }
  };

  fetchReviewStats();
}, []);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    async function fetchBooking(){
      try{
        console.log(id)
        const {data} = await axios.get(`/v1/villas/${id}`)
        if(data.statusCode!==200){
          toast.error("No Booking Data Found")
          setProperty({})
        }else{
          setProperty(data.data)
        }
      }catch(error){
        console.error("Error fetching exclusive data:", error);
        setError(true)
      }
    }
    fetchBooking()
  },[])

  if(!property && !error){
    return <div>
      <h1 className="flex justify-center items-center h-screen"><Loader className=" font-extrabold size-11 animate-spin"/></h1>
    </div>
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600">Something went wrong. Please try again later.</p>
      </div>
    )
  }

  if (Object.keys(property).length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No booking found for villa ID <strong>{id}</strong>.</p>
      </div>
    )
  }


  // console.log(property)

const stats = getReviewStatsForVilla(property._id);
const averageRating = stats?.averageRating ?? 0;
const reviewCount = stats?.reviewCount ?? 0;


  return (
    <div id="booking-top">
      <VillaHeader
      title={property.villaName}
      photos={property.images}
      rating={averageRating}        
      reviewCount={reviewCount}      
      rooms={property.numberOfRooms}
    />

      <Gallery photos={property.images}/>
      <VillaDetails property={property}/>
      {/* <Testimonials/> */}  
    </div>
  )
}

export default Booking