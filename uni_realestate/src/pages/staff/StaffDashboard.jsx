import { useEffect, useState } from "react";
import API from "../../utils/api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import { Badge } from "../../components/ui/badge";

import { ClipboardList, Clock, Wrench, CheckCircle } from "lucide-react";

export default function StaffDashboard() {
  const [stats, setStats] = useState({});
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/staff/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(res.data.stats);
      setRecentTasks(res.data.recentTasks || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Tasks",
      value: stats.total || 0,
      icon: ClipboardList,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },

    {
      title: "Pending",
      value: stats.pending || 0,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },

    {
      title: "In Progress",
      value: stats.inProgress || 0,
      icon: Wrench,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },

    {
      title: "Completed",
      value: stats.completed || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "assigned":
        return "bg-purple-100 text-purple-700";

      case "in-progress":
        return "bg-blue-100 text-blue-700";

      case "completed":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Staff Dashboard</h1>

        <p className="text-slate-500 mt-1">
          Track assigned maintenance tasks and progress
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{item.title}</p>

                    <h2 className="text-3xl font-bold mt-2">{item.value}</h2>
                  </div>

                  <div className={`p-3 rounded-2xl ${item.bg}`}>
                    <Icon className={`size-6 ${item.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* RECENT TASKS */}
      <Card className="shadow-sm border-0">
        <CardHeader>
          <CardTitle className="text-xl">Recent Maintenance Tasks</CardTitle>
        </CardHeader>

        <CardContent>
          {recentTasks.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No maintenance assigned
            </div>
          ) : (
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div
                  key={task._id}
                  className="border rounded-2xl p-5 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900">
                        {task.title}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        {task.property?.title || task.amenity?.name}
                      </p>

                      <p className="text-sm text-gray-600 mt-2">
                        Tenant: {task.tenant?.fullname}
                      </p>
                    </div>

                    <Badge
                      className={`${getStatusColor(task.status)} px-3 py-1`}
                    >
                      {task.status}
                    </Badge>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-sm text-gray-600 mt-4">
                    {task.description}
                  </p>

                  {/* DATE */}
                  <div className="mt-4 text-xs text-gray-400">
                    {new Date(task.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
