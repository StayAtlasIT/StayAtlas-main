import { useEffect, useState } from "react";
import axios from "axios";


export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeUser, setActiveUser] = useState(null);
  const [visibleCount, setVisibleCount] = useState(20);

  // 1. Fetch users on load
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/v1/users/users"); 
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // 2. Toggle Ban Status
  const toggleBanStatus = async (id) => {
    let reason = "";
    if (!users.find((u) => u._id === id)?.isBanned) {
      reason = prompt("Enter reason for banning the user:");
      if (!reason) return alert("Ban reason is required!");
    }

    try {
      const res = await axios.patch(`/v1/users/users/${id}/toggle-ban`, {
        reason,
      });

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, isBanned: !user.isBanned } : user
        )
      );

      if (activeUser?._id === id) {
  setActiveUser((prev) => ({
    ...prev,
    isBanned: !prev.isBanned,
    banReason: !prev.isBanned ? reason : "",
    bannedAt: !prev.isBanned ? new Date().toISOString() : null, // 👈 Fix
  }));
}

    } catch (err) {
      console.error("Failed to toggle ban:", err);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.bookingHistory || []).some((booking) =>
        booking?.room?.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleDeleteUser = async (id) => {
  const confirmDelete = confirm("Are you sure you want to permanently delete this user?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`/v1/users/users/${id}`);
    setUsers((prev) => prev.filter((u) => u._id !== id));
    setActiveUser(null);
    alert("User deleted successfully!");
  } catch (err) {
    console.error("Error deleting user:", err);
    alert("Failed to delete user.");
  }
};


// show more less button

const handleShowMore = () => {
  setVisibleCount((prev) => prev + 20);
};

const handleShowLess = () => {
  setVisibleCount(20);
};

const visibleUsers = filteredUsers.slice(0, visibleCount);


  return (
    <div className="p-10 bg-white min-h-screen text-gray-800 relative">
      <div className="mb-8 text-center">
  <h1 className="text-3xl md:text-4xl font-extrabold text-green-700 tracking-tight">
    User Management
  </h1>
  <p className="mt-2 text-gray-600 text-base md:text-lg font-medium">
    Total Users:{" "}
    <span className="font-semibold text-gray-900">
      {filteredUsers.length}
    </span>
  </p>
</div>


      <div className="flex justify-end mb-5">
        <input
          type="text"
          placeholder="Search users..."
          className="px-5 py-3 w-80 border border-gray-500 rounded-md text-base"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* User Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => setActiveUser(user)}
            className={`cursor-pointer border border-gray-400 hover:border-blue-500 p-4 rounded-lg bg-gray-100 shadow-sm transition-all ${
              activeUser?._id === user._id ? "border-blue-500 bg-blue-50" : ""
            }`}
          >
            <p>
              <strong>Name:</strong> {user.firstName} {user.lastName}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={user.isBanned ? "text-red-500" : "text-green-600"}
              >
                {user.isBanned ? "Banned" : "Active"}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              <strong>Bookings:</strong> {user.bookingHistory?.length || 0}
            </p>
          </div>
        ))}
      </div>

      {/* Show More / Less Buttons */}
      {filteredUsers.length > 20 && (
        <div className="flex justify-center mt-6 gap-4">
          {visibleCount < filteredUsers.length && (
            <button
              onClick={handleShowMore}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Show More
            </button>
          )}

          {visibleCount > 20 && (
            <button
              onClick={handleShowLess}
              className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Show Less
            </button>
          )}
        </div>
      )}
      

      {/* Slide-in Detail Panel */}
      {activeUser && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end transition-opacity duration-300">
          <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[50%] bg-white h-full shadow-lg p-6 overflow-y-auto relative transform translate-x-0 transition-transform duration-300">
            <button
              onClick={() => setActiveUser(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold mb-4">User Details</h2>

            <div className="mb-6">
              <p>
                <strong>Name:</strong> {activeUser.firstName}{" "}
                {activeUser.lastName}
              </p>
              <p className="mb-2">
                <strong>Email:</strong> {activeUser.email}
              </p>
              <p className="mb-2">
                <strong>Status:</strong>{" "}
                <span
                  className={
                    activeUser.isBanned ? "text-red-500" : "text-green-600"
                  }
                >
                  {activeUser.isBanned ? "Banned" : "Active"}
                </span>
              </p>

              {activeUser.isBanned && (
                <>
                  <p className="mb-2">
                    <strong>Ban Reason:</strong>{" "}
                    {activeUser.banReason || "Not specified"}
                  </p>
                  <p className="mb-2">
                    <strong>Banned At:</strong>{" "}
                    {activeUser.bannedAt
                      ? new Date(activeUser.bannedAt).toLocaleString()
                      : "N/A"}
                  </p>
                </>
              )}

              <div className="flex gap-3 mt-2">
  <button
    onClick={() => toggleBanStatus(activeUser._id)}
    className={`px-4 py-2 rounded ${
      activeUser.isBanned
        ? "bg-green-500 hover:bg-green-600"
        : "bg-red-500 hover:bg-red-600"
    } text-white`}
  >
    {activeUser.isBanned ? "Unban User" : "Ban User"}
  </button>

  {activeUser.isBanned && (
    <button
      onClick={() => handleDeleteUser(activeUser._id)}
      className="px-4 py-2 rounded bg-gray-800 hover:bg-black text-white"
    >
      Delete User
    </button>
  )}
</div>

            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Booking History</h3>
              {activeUser.bookingHistory?.length > 0 ? (
                <div className="space-y-4">
                  {activeUser.bookingHistory.map((booking, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-md p-4 shadow-sm bg-white"
                    >
                      <p>
                        <strong>Villa:</strong>{" "}
                        {booking.villa?.villaName || "Villa Name Not Found"}
                      </p>

                      <p>
                        <strong>Guests:</strong> Adults: {booking.guests.adults}
                        , Children: {booking.guests.children}, Pets:{" "}
                        {booking.guests.pets}
                      </p>

                      <p>
                        <strong>Dates:</strong>{" "}
                        {new Date(booking.checkIn).toLocaleDateString()} to{" "}
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Duration:</strong> {booking.nights} nights
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span
                          className={
                            booking.status === "Pending"
                              ? "text-yellow-500"
                              : booking.status === "Confirmed"
                              ? "text-green-600"
                              : booking.status === "Cancelled"
                              ? "text-red-500"
                              : booking.status === "Completed"
                              ? "text-blue-500"
                              : "text-gray-600"
                          }
                        >
                          {booking.status}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No booking history found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    
  );
}
