import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import axios from "../../utils/axios"
import { ChevronDown, CheckCircle, XCircle } from 'lucide-react';

export default function BookingManagement() {
  const [activeTab, setActiveTab] = useState('all-bookings');
  const [activePage, setActivePage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    async function fetchAllBookings(){
      try{
        const response = await axios.get("/v1/bookings")
        if(response.data.statusCode === 200){
          setBookings(response.data.data)
          // console.log("Bookings: ", response.data.data)
        }else{
          toast.error("Error fetching bookings")
        }
      }catch(err){
        console.error("Error fetching bookings: ",err);
        toast.error("Error fetching bookings");
      }
    }
    fetchAllBookings();
  },[])

  useEffect(() => {
    function onClickOutside(e) {
      if (openMenuId === null) return;

      const clickedElement = e.target.closest(`[data-menu-id="${openMenuId}"]`);
      if (!clickedElement) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [openMenuId]);


  // const villas = [
  //   {
  //     id: 1,
  //     name: "Himalayan Pine Lodge",
  //     propertyType: "Mountain Lodge",
  //     rooms: 4,
  //     maxGuests: 6,
  //     basePrice: "₹65,000 / week",
  //     location: "112 Cedar Lane, Near Hadimba Temple, Manali, Himachal Pradesh",
  //     description: "A cozy wooden lodge nestled among pine forests with stunning views of snow-capped peaks.",
  //     amenities: ["Heated Floors", "Apple Orchard", "Snowview Terrace", "Traditional Himachali Kitchen"],
  //     photos: ["/api/placeholder/400/300", "/api/placeholder/400/300"]
  //   },
  //   {
  //     id: 2,
  //     name: "Goan Beach Haven",
  //     propertyType: "Beach Villa",
  //     rooms: 3,
  //     maxGuests: 5,
  //     basePrice: "₹78,500 / week",
  //     location: "45 Seaside Road, Near Anjuna Beach, Candolim, Goa",
  //     description: "A luxurious beachfront villa with private access to the beach.",
  //     amenities: ["Infinity Pool", "Private Beach Access", "Outdoor BBQ", "Sunset Deck", "Modern Kitchen"],
  //     photos: ["/api/placeholder/400/300", "/api/placeholder/400/300"]
  //   }
  // ];


  // console.log(bookings)

const searchFilteredBookings = bookings.filter(booking => {
  if (!searchQuery) return true;

  const queryWords = searchQuery.toLowerCase().split(" ").filter(Boolean); 

  const user = booking.user || {};
  const villa = booking.villa || {};

  const fields = [
    user.firstName || '',
    user.lastName || '',
    user.email || '',
    villa.villaName || ''
  ].join(" ").toLowerCase(); 

  
  return queryWords.every(word => fields.includes(word));
});



  const filteredBookings = searchFilteredBookings.filter(booking => {
    if (activeTab === 'all-bookings') return true;
    if (activeTab === 'confirmed-bookings') return booking.status === 'Confirmed';
    if (activeTab === 'completed') return booking.status === 'Completed';
    if (activeTab === 'pending-bookings') return booking.status === 'Pending';
    if (activeTab === 'cancelled-bookings') return booking.status === 'Cancelled';
    return false;
  });


  const ITEMS_PER_PAGE = 20; 
  const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedBookings = filteredBookings.slice(startIndex, endIndex);
  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / ITEMS_PER_PAGE));
  
  // const paginatedVillas = villas.slice(startIndex, endIndex);
  // const totalVillaPages = Math.max(1, Math.ceil(villas.length / ITEMS_PER_PAGE));


  const bookingStats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    pending: bookings.filter(b => b.status === 'Pending').length,
    cancelled: bookings.filter(b => b.status === 'Cancelled').length,
    completed: bookings.filter(b => b.status === 'Completed').length,
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setActivePage(1); 
  };

  const handleActionClick = async(action, booking) => {
    // console.log(`${action} booking: `, booking);
    if(action === 'Approve') {
      try{
        const response = await axios.post(`/v1/admin/accept-user-booking/${booking._id}`)
        // console.log("POSTING TO: ", `/api/v1/admin/accept-user-booking/${booking._id}`);
        console.log("Response: ", response)
        if(response.data.statusCode === 200){
          toast.success("Booking approved successfully")
          setBookings(prevBookings => prevBookings.map(b => b._id === booking._id ? { ...b, status: 'Confirmed' } : b));
        }else{
          toast.error("Error approving booking")
        }
      }catch(err){
        console.error("Error approving booking: ", err);
        toast.error("Error approving booking");
      }
    }
    if(action === 'Reject') {
      try{
        const response = await axios.post(`/v1/admin/reject-user-booking/${booking._id}`)
        // console.log("Response: ", response)
        if(response.data.statusCode === 200){
          toast.success("Booking rejected successfully")
          // setBookings(prevBookings => prevBookings.filter(b => b._id !== booking._id));
          setBookings(prevBookings => prevBookings.map(b => b._id === booking._id ? { ...b, status: 'Cancelled' } : b));
        }else{
          toast.error("Error rejecting booking")
        }
      }catch(err){
        console.error("Error rejecting booking: ", err);
        toast.error("Error rejecting booking");
      }
    }
  };

  const handleVillaAction = (action, villa) => {
    alert(`${action} villa: ${villa.name}`);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setActivePage(1);
  };

  const handlePreviousPage = () => {
    if (activePage > 1) {
      setActivePage(activePage - 1);
    }
  };

  const handleNextPage = () => {
    const maxPages = activeTab === 'villa-details' ? totalVillaPages : totalPages;
    if (activePage < maxPages) {
      setActivePage(activePage + 1);
    }
  };
  // console.log(paginatedBookings)
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="mb-8 text-center">
        <h1 className="text-2xl md:text-4xl font-extrabold text-green-700 tracking-tight">
           Booking Management
        </h1>
      </div>

      <div className="max-w-8xl mx-auto px-4 py-8">
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm text-gray-500 mb-2">Total Bookings</h3>
            <div className="text-3xl font-bold text-green-600">{bookingStats.total}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm text-gray-500 mb-2">Completed Bookings</h3>
            <div className="text-3xl font-bold text-red-600">{bookingStats.completed}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm text-gray-500 mb-2">Confirmed Bookings</h3>
            <div className="text-3xl font-bold text-blue-600">{bookingStats.confirmed}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm text-gray-500 mb-2">Pending Bookings</h3>
            <div className="text-3xl font-bold text-orange-600">{bookingStats.pending}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm text-gray-500 mb-2">Cancelled Bookings</h3>
            <div className="text-3xl font-bold text-red-600">{bookingStats.cancelled}</div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex border-b border-gray-200 mb-4">
            <button 
              className={`py-2 px-4 font-medium ${activeTab === 'all-bookings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => handleTabChange('all-bookings')}
            >
              All Bookings
            </button>
            <button 
              className={`py-2 px-4 font-medium ${activeTab === 'completed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => handleTabChange('completed')}
            >
              Completed
            </button>
            <button 
              className={`py-2 px-4 font-medium ${activeTab === 'confirmed-bookings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => handleTabChange('confirmed-bookings')}
            >
              Confirmed
            </button>
            <button 
              className={`py-2 px-4 font-medium ${activeTab === 'pending-bookings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => handleTabChange('pending-bookings')}
            >
              Pending
            </button>
            <button 
              className={`py-2 px-4 font-medium ${activeTab === 'cancelled-bookings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => handleTabChange('cancelled-bookings')}
            >
              Cancelled
            </button>
            {/* <button 
              className={`py-2 px-4 font-medium ${activeTab === 'villa-details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => handleTabChange('villa-details')}
            >
              Villa Details
            </button> */}
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {activeTab !== 'villa-details' && (
              <div className="p-4 border-b border-gray-200">
                <input 
                  type="text" 
                  placeholder="Search by name, villa, or email..." 
                  className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            )}

            {activeTab !== 'villa-details' ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Villa Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-Out</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                      
                      
                      
                      {activeTab === 'all-bookings' && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      )}
                      {activeTab !== 'completed' && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedBookings.length > 0 ? (
                      paginatedBookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`STAY${booking._id.slice(-7)}`}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`${booking?.user?.firstName} ${booking?.user?.lastName}`}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.villa ? booking.villa?.villaName : "Villa not available"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(booking.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(booking.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.totalAmount?.$numberDecimal}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.guests?.adults+booking.guests?.children+booking.guests?.pets}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.user?.email === ""  ? "Not Provided" : booking.user?.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.user?.phoneNumber ? booking.user?.phoneNumber : "Not Provided"}</td>
                          
                          
                          
                          {activeTab === 'all-bookings' && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                                  booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                                  'bg-blue-500 text-gray-100'}`}>
                                {booking.status}
                              </span>
                            </td>
                          )}
                          {activeTab !== 'completed' && <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {/* <button 
                              className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md mr-2 text-sm"
                              onClick={() => handleActionClick('View', booking)}
                            >
                              View
                            </button> */}
                            {/* <button 
                              className="bg-yellow-50 text-yellow-600 px-3 py-1 rounded-md mr-2 text-sm"
                              onClick={() => handleActionClick('Edit', booking)}
                            >
                              Edit
                            </button> */}
                            <div className="relative inline-block text-left" data-menu-id={booking._id}>
                              <button
                                onClick={() => setOpenMenuId(curr => curr === booking._id ? null : booking._id)}
                                className="flex items-center bg-yellow-50 text-yellow-600 px-3 py-1 rounded-md mr-2 text-sm hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                              >
                                Actions
                                <ChevronDown className="ml-1 h-4 w-4" />
                              </button>
                              
                              {openMenuId === booking._id &&  
                              (
                                <div className="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                                  <div className="py-1">
                                    <button
                                      onClick={() => {
                                        handleActionClick('Approve', booking);
                                        setOpenMenuId(null);
                                        // console.log("Approve booking: ", booking);
                                      }}
                                      className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                                    >
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleActionClick('Reject', booking);
                                        setOpenMenuId(null);
                                        // console.log("Reject booking: ", booking);
                                      }}
                                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Reject
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>

                          </td>}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={activeTab === 'all-bookings' ? 9 : 8} className="px-6 py-10 text-center text-gray-500">
                          No bookings found for the current filter
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4">
                {paginatedVillas.length > 0 ? (
                  paginatedVillas.map((villa) => (
                    <div key={villa.id} className="bg-white mb-6 rounded-lg overflow-hidden">
                      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">{villa.name}</h2>
                        <div>
                          <button 
                            className="bg-yellow-50 text-yellow-600 px-3 py-1 rounded-md mr-2"
                            onClick={() => handleVillaAction('Edit', villa)}
                          >
                            Edit Villa
                          </button>
                          <button 
                            className="bg-red-50 text-red-600 px-3 py-1 rounded-md"
                            onClick={() => handleVillaAction('Remove', villa)}
                          >
                            Remove Villa
                          </button>
                        </div>
                      </div>
                      <div className="p-6 grid grid-cols-3 gap-6">
                        <div>
                          <div className="flex flex-col space-y-2">
                            <img src={villa.photos[0]} alt="Villa" className="w-full h-40 object-cover rounded-lg" />
                            <img src={villa.photos[1]} alt="Villa" className="w-full h-40 object-cover rounded-lg" />
                          </div>
                        </div>
                        <div className="col-span-2 grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-500">ID</label>
                            <p className="mt-1">{villa.id}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Property Type</label>
                            <p className="mt-1">{villa.propertyType}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Rooms</label>
                            <p className="mt-1">{villa.rooms}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Max Guests</label>
                            <p className="mt-1">{villa.maxGuests}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Base Price</label>
                            <p className="mt-1">{villa.basePrice}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Location</label>
                            <p className="mt-1">{villa.location}</p>
                          </div>
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-500">Description</label>
                            <p className="mt-1">{villa.description}</p>
                          </div>
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-500">Amenities</label>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {villa.amenities.map((amenity, index) => (
                                <span key={index} className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <p>No villas to display on this page</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 overflow-x-auto">
  <div className="flex justify-start md:justify-end gap-2 w-max min-w-full">
    <button 
      className={`border border-gray-300 px-3 py-1 rounded ${activePage > 1 ? 'bg-white hover:bg-gray-50' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
      onClick={handlePreviousPage}
      disabled={activePage <= 1}
    >
      Previous
    </button>

    {Array.from({ length: activeTab === 'villa-details' ? totalVillaPages : totalPages }, (_, i) => (
      <button 
        key={i + 1}
        className={`px-3 py-1 rounded ${activePage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}
        onClick={() => setActivePage(i + 1)}
      >
        {i + 1}
      </button>
    ))}

    <button 
      className={`border border-gray-300 px-3 py-1 rounded ${activePage < (activeTab === 'villa-details' ? totalVillaPages : totalPages) ? 'bg-white hover:bg-gray-50' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
      onClick={handleNextPage}
      disabled={activePage >= (activeTab === 'villa-details' ? totalVillaPages : totalPages)}
    >
      Next
    </button>
  </div>
</div>

        </div>
      </div>
    </div>
  );
}