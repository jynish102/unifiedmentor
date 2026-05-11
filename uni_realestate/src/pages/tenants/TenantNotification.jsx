import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import API from "../../utils/api";

export default function TenantNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setNotifications(res.data.data || []);
    } catch (error) {
      console.log("Notification fetch error:", error.res?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-3 rounded-xl">
          <Bell className="text-blue-600 size-6" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Notifications
          </h1>

          <p className="text-sm text-gray-500">
            Stay updated with latest activity
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-md p-10 text-center">
          <p className="text-gray-500">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl shadow-md p-10 text-center">
          <Bell className="mx-auto text-gray-300 size-10 mb-3" />

          <p className="text-gray-500 font-medium">
            No notifications found
          </p>
        </div>
      ) : (
        /* Notification List */
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`bg-white rounded-2xl shadow-md p-5 border transition hover:shadow-lg ${
                !notification.isRead
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-100"
              }`}
            >
              <div className="flex justify-between items-start gap-4 px-3 py-3">
                <div className="flex-1">
                  {/* Title */}
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-gray-900">
                      {notification.title}
                    </h2>

                    {!notification.isRead && (
                      <span className="size-2 rounded-full bg-blue-500" />
                    )}
                  </div>

                  {/* Message */}
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>

                  {/* Type */}
                  <p className="text-xs text-blue-600 font-medium mt-3 uppercase">
                    {notification.type}
                  </p>
                </div>

                {/* Date */}
                <div className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(notification.createdAt).toLocaleString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}