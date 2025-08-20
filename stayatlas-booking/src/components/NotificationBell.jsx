import { useEffect, useState } from "react";
import { Bell, Trash2, Check } from "lucide-react";
import axios from "axios";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/v1/users/notifications", {
        withCredentials: true,
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      setLoading(true);
      await axios.put(
        "/v1/users/notifications?action=read",
        {},
        { withCredentials: true }
      );
      fetchNotifications();
    } catch (err) {
      console.error("Error marking notifications as read", err);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = async () => {
    try {
      setLoading(true);
      await axios.delete("/v1/users/notifications?action=clear", {
        withCredentials: true,
      });
      setNotifications([]);
    } catch (err) {
      console.error("Error clearing notifications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      fetchNotifications();
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      {/* Bell Icon with exact golden color (#D9B17B) */}
      <div className="absolute top-4 right-4 cursor-pointer">
        <div className="relative" onClick={handleBellClick}>
          <Bell
            size={25}
            className="hover:scale-110 transition-transform duration-200"
            style={{ color: "#D9B17B" }}
            fill="#D9B17B"
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1 bg-red-600 text-white text-[12px] rounded-full px-1 font-semibold leading-tight">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-16 right-4 bg-white shadow-xl rounded-xl w-80 max-h-96 overflow-y-auto z-50">
          <div className="flex justify-between items-center px-4 py-3 bg-gray-100 rounded-t-xl">
            <h4 className="text-base font-semibold text-gray-800">
              Notifications
            </h4>
            <div className="flex gap-3">
              <Check
                size={18}
                className="text-green-600 cursor-pointer hover:text-green-700"
                onClick={markAllAsRead}
                title="Mark all as read"
              />
              <Trash2
                size={18}
                className="text-red-600 cursor-pointer hover:text-red-700"
                onClick={clearAll}
                title="Clear all"
              />
            </div>
          </div>

          {/* Notifications */}
          {notifications.length === 0 && !loading ? (
            <p className="text-sm text-gray-500 px-4 py-6 text-center">
              No notifications
            </p>
          ) : (
            notifications.map((notif, idx) => (
              <div
                key={idx}
                className={`px-4 py-3 ${
                  notif.isRead ? "bg-white" : "bg-yellow-50"
                } border-b`}
              >
                <p className="text-sm font-medium text-gray-800">
                  {notif.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notif.date).toLocaleString()}
                </p>
              </div>
            ))
          )}

          {/* Loading */}
          {loading && (
            <div className="py-3 text-center">
              <span className="text-xs text-gray-500 animate-pulse">
                Processing...
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
