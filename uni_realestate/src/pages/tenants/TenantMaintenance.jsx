import { useEffect, useState } from "react";
import API from "../../utils/api";

import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

export default function TenantMaintenance() {
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/maintenance/my-maintenance", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMaintenance(res.data.data || []);
      } catch (err) {
        console.error("Error fetching maintenance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenance();
  }, []);

  //  Priority colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "emergency":
        return "bg-red-100 text-red-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Status colors
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-700";
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">My Maintenance Requests</h2>

      {/* No data */}
      {maintenance.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No maintenance requests yet
        </div>
      )}

      {/* List */}
      <div className="grid gap-4">
        {maintenance.map((item) => (
          <Card key={item._id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{item.title}</h3>

                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>

              <p className="text-gray-600">
                {item.description || "No description"}
              </p>

              {/* Property info */}
              <p className="text-sm text-gray-500">🏠 {item.property?.title}</p>

              <div className="flex justify-between items-center text-sm">
                <Badge className={getPriorityColor(item.priority)}>
                  {item.priority}
                </Badge>

                <span className="text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
