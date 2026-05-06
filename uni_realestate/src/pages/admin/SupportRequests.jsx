import { useState, useEffect } from "react";
import API from "../../utils/api"
import toast from "react-hot-toast"
import { Button } from "../../components/ui/button";

export default function SupportRequest(){
    const [requests, setRequests] = useState([]);

    useEffect(() => {
      const fetchRequests = async () => {
        try {
          const token = localStorage.getItem("token");

          const res = await API.get("/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("API RESPONSE:", res.data); //
          setRequests(res.data.data);
        } catch (err) {
          console.error(err);
        }
      };

      fetchRequests();
    }, []);

    const handleResolve = async (id) => {
         if (!id) {
           console.error("ID is undefined");
           return;
         }
      try {
        await API.put(`/support/${id}`);

        setRequests((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: "resolved" } : r)),
        );
      } catch (err) {
        console.error(err.response?.data?.message);
      }
    };

    const handleReactivate = async (email) => {
      try {
        await API.put("/auth/reactivate", { email });

        toast.success("User reactivated");
      } catch (err) {
        console.error(err.response?.data?.message);
      }
    };
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Support Requests</h2>

        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="border p-4 rounded-lg flex justify-between items-start"
            >
              <div>
                <p className="font-semibold">{req.name}</p>
                <p className="text-sm text-gray-500">{req.email}</p>

                <p className="text-sm mt-2">{req.message}</p>

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(req.createdAt).toLocaleString()}
                </p>

                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                  {req.inquiryType}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {/* Reactivate button */}
                {req.inquiryType === "reactivate account" && (
                  <Button
                    onClick={() => handleReactivate(req.email)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Reactivate
                  </Button>
                )}

                {/* Resolve button */}
                {req.status !== "resolved" && (
                  <Button
                    onClick={() => handleResolve(req._id || req.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Mark Resolved
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}