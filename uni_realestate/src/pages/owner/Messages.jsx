import { useEffect, useState } from "react";
import API from "../../utils/api";
import toast from "react-hot-toast"

export default function OwnerMessages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/messages/owner", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMessages(res.data.data);
      } catch (err) {
        console.log(err);
        toast.error(err.response?.data?.message || "failed fetch message")
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Tenant Messages</h2>

      {messages.length === 0 ? (
        <p className="text-gray-500">No messages</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg._id} className="border p-4 rounded-lg">
              <p className="font-semibold">{msg.subject || "No Subject"}</p>

              <p className="text-sm text-gray-600 mt-1">
                From: {msg.sender?.fullname} ({msg.sender?.email})
              </p>

              <p className="text-sm text-gray-500">
                Property: {msg.property?.title}
              </p>

              <p className="mt-2">{msg.message}</p>

              <p className="text-xs text-gray-400 mt-2">
                {new Date(msg.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
