import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Building2, Users, DollarSign, TrendingUp } from "lucide-react";
import API from "../../utils/api";
import toast from "react-hot-toast";

// 🎯 Icon mapping (backend sends string)
const iconMap = {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
};

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"];

export default function AdminDashboard() {
  const [stats, setStats] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);
  const [propertyTypeData, setPropertyTypeData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/admin/dashboard/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;

        setStats(data.stats || []);
        setRevenueData(data.revenueData || []);
        setOccupancyData(data.occupancyData || []);
        setPropertyTypeData(data.propertyTypeData || []);
        setRecentActivity(data.recentActivity || []);
      } catch (error) {
        console.error("Dashboard API error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const typeColor = {
    Booking: "bg-blue-500",
    Maintenance: "bg-orange-500",
    User: "bg-green-500",
  };

  if (loading) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">
          Dashboard Overview
        </h2>
        <p className="text-slate-500 mt-1">
          Welcome back! Here's what's happening with your properties.
        </p>
      </div>

      {/* 🔹 Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.length > 0 ? (
          stats.map((stat) => {
            const Icon = iconMap[stat.icon] || Building2;

            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{stat.title}</p>
                      <p className="text-2xl font-bold mt-2">{stat.value}</p>
                      <p
                        className={`text-sm mt-1 ${
                          stat.change.includes("-")
                            ? "text-red-500"
                            : "text-green-600"
                        }`}
                      >
                        {stat.change} from last month
                      </p>
                    </div>

                    <div
                      className={`${stat.color || "bg-gray-400"} p-3 rounded-lg`}
                    >
                      {Icon && <Icon className="text-white" size={24} />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <p className="text-gray-400 col-span-4 text-center">
            No stats available
          </p>
        )}
      </div>

      {/*  Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => `₹${value.toLocaleString()}`}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-center py-10">No revenue data</p>
            )}
          </CardContent>
        </Card>

        {/* Occupancy */}
        <Card>
          <CardHeader>
            <CardTitle> Current Occupancy Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="rate" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 🔹 Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div
                    key={activity._id || activity.time}
                    className="flex items-start gap-3 p-4 bg-white rounded-xl border hover:shadow-sm transition"
                  >
                    {/* Left dot */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          typeColor[activity.type] || "bg-gray-400"
                        }`}
                      />
                      <div className="w-px h-full bg-gray-200 mt-1" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      {/* Title */}
                      <p className="text-sm font-semibold text-gray-900">
                        {activity.type}
                      </p>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.description}
                      </p>

                      {/* Time */}
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(activity.time).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-6">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Properties by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              {propertyTypeData.length > 0 ? (
                <PieChart>
                  <Pie
                    data={propertyTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      percent ? `${name} ${(percent * 100).toFixed(0)}%` : name
                    }
                  >
                    {propertyTypeData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={
                          COLORS[
                            propertyTypeData.indexOf(entry) % COLORS.length
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}`, name]} />
                </PieChart>
              ) : (
                <p className="text-gray-400 text-center py-10">
                  No property data
                </p>
              )}
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {propertyTypeData.map((item) => (
                <div key={item.name} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
