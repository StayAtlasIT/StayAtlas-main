import { useState } from "react";
import {
  Calendar,
  User,
  Home,
  Phone,
  Mail,
  Clock,
  MapPin,
  Check,
  Menu,
  X,
  Heart,
} from "lucide-react";
import { useEffect } from "react";
import NotificationBell from "./NotificationBell";
import axios from "axios";
import Eye from "lucide-react/dist/esm/icons/eye";
import EyeClosed from "lucide-react/dist/esm/icons/eye-closed";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { ContactlessOutlined } from "@mui/icons-material";
import { CalendarCheck, History, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import EditProfile from "./EditProfile";

export default function UserProfile() {

  let user = useSelector((state) => state.auth);
  const [userProfileEdited, setUserProfileEdited] = useState(false)
  const [activeTab, setActiveTab] = useState("profile");
  const [bookingTab, setBookingTab] = useState("upcoming");
  const [bookings, setBookings] = useState([]);
  const [villa, setVilla] = useState(null);
  const [reviewStats, setReviewStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [resetPassword, setResetPassword] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [newProfile, setNewProfile] = useState({
      name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
      email:user.email || null,
      phone:user.userPhone || null
  })
  const [showPassword, setShowPassword] = useState(false);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [likedVillas, setLikedVillas] = useState([]);
  const [loadingLikedVillas, setLoadingLikedVillas] = useState(false);


  // useEffect(() => {
  //   if (userProfileEdited == true) {
  //     // window.location.reload()
  //   }
  // }, [userProfileEdited]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setResetPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      if (!resetPassword.currentPassword || !resetPassword.newPassword) {
        toast.error("Please fill in both fields.");
        return;
      }
      if (resetPassword.currentPassword === resetPassword.newPassword) {
        toast.error("New password cannot be the same as current password.");
        return;
      }
      if (resetPassword.newPassword.length < 5) {
        toast.error("New password must be at least 5 characters long.");
        return;
      }
      const response = await axios.post("/v1/users/changePassword", {
        oldPassword: resetPassword.currentPassword,
        newPassword: resetPassword.newPassword,
      });
      console.log("Password change response:", response.data);
      toast.success("Password changed successfully");
      setShowChangePassword(false);
      setResetPassword({ currentPassword: "", newPassword: "" });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password. Please try again.");
    }
  };

  // // for handle cancel booking
  // const handleCancelBooking = async (bookingId) => {
  //   try {
  //     const reason = prompt("Please enter cancellation reason:");
  //     if (!reason || reason.trim() === "") return;

  //     await axios.patch(
  //       `/v1/bookings/${bookingId}/cancel`,
  //       { reason }, // IMPORTANT: Send reason in body
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`, //Token must
  //         },
  //       }
  //     );

  //     toast.success("Booking cancelled successfully!");

  //     // Refresh booking list
  //     fetchBookings();
  //   } catch (error) {
  //     console.error("Cancel failed:", error.response?.data || error.message);
  //   }
  // };

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(`/v1/bookings/user?type=${bookingTab}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBookings(data?.data || []);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
      toast.error("An error occurred while fetching bookings.");
    }
  };

  const fetchLikedVillas = async () => {
    setLoadingLikedVillas(true);
    try {
      const { data } = await axios.get("/v1/users/liked-villas", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (data?.success) {
        setLikedVillas(data?.likedVillasData || []);
      }
    } catch (error) {
      console.error("Failed to fetch liked villas", error);
      setLikedVillas([]);
    } finally {
      setLoadingLikedVillas(false);
    }
  };

  useEffect(() => {
    if (activeTab === "bookings") {
      const fetchBookings = async () => {
        try {
          const { data } = await axios.get(
            `/v1/bookings/user?type=${bookingTab}`
          ); //  Fetch bookings by type
          setBookings(data?.data || []);
        } catch (error) {
          console.error("Failed to fetch bookings", error);
          toast.error("An error occurred while fetching bookings.");
        }
      };

      fetchBookings();
    } else if (activeTab === "liked") {
      fetchLikedVillas();
    }
  }, [activeTab, bookingTab]);

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
    <>
      <div className="bg-gray-50 min-h-screen">
        <main className="container mx-auto px-4 pt-20 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 mx-auto">
              <div className="bg-white rounded-lg shadow p-6 mb-6 flex flex-col items-center">
                <img
                  src={`https://api.dicebear.com/5.x/initials/svg/seed=${user.firstName}`}
                  alt={user.firstName}
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
                <h2 className="text-xl font-bold mb-1">
                  {user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)} {user.lastName ? user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1) : ''}
                </h2>
                {user.email && <p className="text-gray-600 mb-1">{user.email}</p>}
                {user.userPhone && <p className="text-gray-600 mb-1">{user.userPhone}</p>}
                <span className="mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full mb-4">Verified</span>
                <button onClick={() => setOpenEditProfile(true)} className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700">
                  Edit Profile
                </button>
              </div>
              {openEditProfile && <EditProfile setNewProfile={setNewProfile} newProfile={newProfile} setUserProfileEdited={setUserProfileEdited} setOpenEditProfile={setOpenEditProfile} user={user}/>}
              
               <div className="bg-white rounded-lg shadow overflow-hidden">
                <div
                  className={`flex items-center p-4 cursor-pointer ${
                    activeTab === "profile"
                      ? "bg-teal-50 border-l-4 border-teal-600"
                      : ""
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="text-teal-600 mr-3" size={20} />
                  <span
                    className={
                      activeTab === "profile"
                        ? "font-medium text-teal-600"
                        : "text-gray-700"
                    }
                  >
                    Profile
                  </span>
                </div>

                <div
                  className={`flex items-center p-4 cursor-pointer ${
                    activeTab === "bookings"
                      ? "bg-teal-50 border-l-4 border-teal-600"
                      : ""
                  }`}
                  onClick={() => setActiveTab("bookings")}
                >
                  <Home className="text-teal-600 mr-3" size={20} />
                  <span
                    className={
                      activeTab === "bookings"
                        ? "font-medium text-teal-600"
                        : "text-gray-700"
                    }
                  >
                    My Bookings
                  </span>
                </div>

                <div
                  className={`flex items-center p-4 cursor-pointer ${
                    activeTab === "liked"
                      ? "bg-teal-50 border-l-4 border-teal-600"
                      : ""
                  }`}
                  onClick={() => setActiveTab("liked")}
                >
                  <Heart className="text-teal-600 mr-3" size={20} />
                  <span
                    className={
                      activeTab === "liked"
                        ? "font-medium text-teal-600"
                        : "text-gray-700"
                    }
                  >
                    Liked Villas
                  </span>
                </div>
              </div>
            </div>

            <div className="md:w-3/4">
              {activeTab === "profile" && (
                <div className="relative">
                <NotificationBell />
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-bold mb-6 pb-2 border-b">
                    Personal Detail
                  </h3>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <div className="flex items-center">
                          <User className="text-gray-500 mr-2" size={18} />
                          <p className="text-gray-900">
                            {user.firstName.charAt(0).toUpperCase() +
                              user.firstName.slice(1)}
                          </p>
                        </div>
                      </div>

                      {user.email && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <div className="flex items-center">
                            <Mail className="text-gray-500 mr-2" size={18} />
                            <p className="text-gray-900">{user.email}</p>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="flex items-center">
                          <Phone className="text-gray-500 mr-2" size={18} />
                          <p className="text-gray-900">{user.userPhone}</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Change Password
                        </label>
                        {!showChangePassword && (
                          <Button
                            onClick={() => setShowChangePassword(true)}
                            variant={"primary"}
                            className={
                              "hover:bg-gray-200 cursor-pointer border border-gray-300"
                            }
                          >
                            Change
                          </Button>
                        )}
                        {showChangePassword && (
                          <form
                            onSubmit={handleResetPassword}
                            className="space-y-2"
                          >
                            <div className="w-full relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                className="w-full p-2 pr-10 border border-gray-300 rounded-md"
                                placeholder="Current Password"
                                value={resetPassword.currentPassword}
                                name="currentPassword"
                                onChange={handleChangePassword}
                              />
                              <div
                                className="absolute right-3 top-2 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <Eye /> : <EyeClosed />}
                              </div>
                            </div>

                            <div className="relative w-full">
                              <input
                                type={showPassword ? "text" : "password"}
                                className="w-full p-2 pr-10 border border-gray-300 rounded-md"
                                placeholder="New Password"
                                value={resetPassword.newPassword}
                                name="newPassword"
                                onChange={handleChangePassword}
                              />
                              <div
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <Eye /> : <EyeClosed />}
                              </div>
                            </div>

                            <Button
                              type="submit"
                              variant={"primary"}
                              className="w-full hover:bg-gray-700 bg-gray-800 text-white cursor-pointer"
                            >
                              Change
                            </Button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t">
                    <h4 className="text-lg font-medium mb-4">
                      Account Preferences
                    </h4>

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          id="newsletter"
                          name="newsletter"
                          type="checkbox"
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label
                          htmlFor="newsletter"
                          className="ml-3 text-sm text-gray-700"
                        >
                          Receive newsletter and promotional emails
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="sms"
                          name="sms"
                          type="checkbox"
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label
                          htmlFor="sms"
                          className="ml-3 text-sm text-gray-700"
                        >
                          Receive SMS notifications for bookings
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              )}

              {/* Bookings Tab  */}
              {activeTab === "bookings" && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-bold mb-4">My Bookings</h3>

                  {/* Booking Filter Tabs */}
                  <div className="grid grid-cols-3 text-sm border-b pb-3 mb-6 text-center ">
                    <button
                      onClick={() => setBookingTab("upcoming")}
                      className={`cursor-pointer flex flex-col items-center gap-1 ${
                        bookingTab === "upcoming"
                          ? "text-teal-600 font-semibold"
                          : "text-gray-500"
                      }`}
                    >
                      <CalendarCheck size={18} />
                      <span>Upcoming booking</span>
                    </button>

                    <button
                      onClick={() => setBookingTab("past")}
                      className={`cursor-pointer flex flex-col items-center gap-1 ${
                        bookingTab === "past"
                          ? "text-teal-600 font-semibold"
                          : "text-gray-500"
                      }`}
                    >
                      <History size={18} />
                      <span>Past booking</span>
                    </button>

                    <button
                      onClick={() => setBookingTab("incomplete")}
                      className={`cursor-pointer flex flex-col items-center gap-1 ${
                        bookingTab === "incomplete"
                          ? "text-teal-600 font-semibold"
                          : "text-gray-500"
                      }`}
                    >
                      <AlertTriangle size={18} />
                      <span>Incomplete booking</span>
                    </button>
                  </div>

                  {/* Bookings List */}
                  {Array.isArray(bookings) && bookings.length === 0 ? (
                    <p className="text-gray-500">
                      No {bookingTab} bookings found.
                    </p>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {Array.isArray(bookings) &&
                        bookings.map((booking) => (
                          // if you want whole card is clickable then attach link here
                          <div
                            key={booking._id}
                            className="border p-4 rounded-lg shadow-sm relative flex flex-col justify-between h-full"
                          >
                            {/* Status badge */}
                            <span
                              className={`absolute top-3 right-3 text-xs font-medium px-3 py-1 rounded-full ${
                                booking.status === "Confirmed"
                                  ? "bg-green-100 text-green-700"
                                  : booking.status === "Completed"
                                  ? "bg-blue-100 text-blue-700"
                                  : booking.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : booking.status === "Cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {booking.status}
                            </span>

                           
                           {/* Image */}
{booking.villa ? (
  <Link to={`/my-booking/${booking.villa._id}/${booking._id}`}>
    <img
      src={booking.villa.images?.[0]}
      alt={booking.villa.villaName}
      className="w-full h-60 object-cover rounded-md cursor-pointer hover:opacity-90 transition"
    />
  </Link>
) : (
  <div className="w-full h-60 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-500">
    Villa data unavailable
  </div>
)}


                            {/* Title */}
                            <h3 className="mt-3 font-semibold text-lg">
                              {booking.villa?.villaName} by stayatlas
                            </h3>

                            {/* Rating */}
                            {(() => {
                              const stats = getReviewStatsForVilla(
                                booking.villa?._id
                              );
                              const averageRating = stats?.averageRating ?? 0.0;
                              const reviewCount = stats?.reviewCount ?? 0;

                              return (
                                <a href="#reviews" className="flex mt-1 items-center gap-1 text-yellow-500 text-sm font-medium cursor-pointer hover:underline">
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
                                    ({reviewCount}{" "}
                                    {reviewCount === 1 ? "review" : "reviews"})
                                  </span>
                                </a>
                              );
                            })()}

                            {/* Location */}
                            <p className="text-sm text-gray-600 flex items-center mt-2">
                              <MapPin size={14} className="mr-1" />
                              {booking.villa?.address?.street},{" "}
                              {booking.villa?.address?.landmark},{" "}
                              {booking.villa?.address?.city},{" "}
                              {booking.villa?.address?.state}
                            </p>

                            {/* Date */}
                            <p className="text-sm text-gray-600 flex items-center mt-2">
                              <Clock size={14} className="mr-1" />
                              {new Date(
                                booking.checkIn
                              ).toLocaleDateString()}{" "}
                              to{" "}
                              {new Date(booking.checkOut).toLocaleDateString()}
                            </p>

                            {/* Amenities */}
                            <div className="border-t text-sm text-gray-700 mt-4">
                              <p>
                                <strong>Total:</strong> ₹
                                {(Number(
                                  booking.totalAmount?.$numberDecimal || 0
                                ) / 100).toLocaleString()}
                              </p>
                              <p>
                                <strong>Guests:</strong>{" "}
                                {booking.guests?.adults} Adults |{" "}
                                {booking.guests?.children} Children |{" "}
                                {booking.guests?.pets} Pets
                              </p>
                              <p>
                                <strong>Rooms:</strong>{" "}
                                {booking.villa?.numberOfRooms}
                              </p>
                              {booking.villa?.amenities?.length > 0 && (
                                <p className="mt-1">
                                  <strong>Amenities:</strong>{" "}
                                  {booking.villa.amenities
                                    .slice(0, 5)
                                    .join(", ")}
                                  {booking.villa.amenities.length > 5
                                    ? "..."
                                    : ""}
                                </p>
                                
                              )}

                              {/* {bookingTab === "upcoming" && (
                                <div className="mt-2 text-right">
                                  <button
                                    onClick={() =>
                                      handleCancelBooking(booking._id)
                                    }
                                    className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-md hover:bg-red-200"
                                  >
                                    Cancel Booking
                                  </button>
                                </div>
                              )} */}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* Liked Villas Tab */}
              {activeTab === "liked" && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-bold mb-4">Liked Villas</h3>

                  {loadingLikedVillas ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                    </div>
                  ) : likedVillas.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 text-lg">No liked villas yet</p>
                      <p className="text-gray-400 text-sm mt-2">
                        Start exploring and like your favorite villas!
                      </p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {likedVillas.map((villa) => (
                        <div
                          key={villa._id}
                          className="border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <Link to={`/booking/${villa._id}`}>
                            <img
                              src={villa.images?.[0]}
                              alt={villa.villaName}
                              className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition"
                            />
                          </Link>

                          <div className="p-4">
                            <h4 className="font-semibold text-lg mb-2">
                              {villa.villaName}
                            </h4>

                            <div className="flex items-center mb-2">
                              <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                              <p className="text-sm text-gray-600">
                                {villa.address?.city}, {villa.address?.state}
                              </p>
                            </div>

                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <span className="text-yellow-500">★</span>
                                <span className="text-sm text-gray-600 ml-1">
                                  {villa.averageRating || 0} ({villa.reviewCount || 0} reviews)
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                {villa.numberOfRooms} rooms • {villa.guestCapacity} guests
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="text-lg font-semibold text-teal-600">
                                ₹{villa.pricePerNightBoth?.weekday || 'N/A'}/night
                              </div>
                              <Link
                                to={`/booking/${villa._id}`}
                                className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 text-sm"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}