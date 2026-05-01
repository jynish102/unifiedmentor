import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Home,
  KeyRound,
  Waves,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useEffect, useState } from "react";
import API from "../../utils/api";


  
  





export  function OwnerDashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/owner/dashboard");
        setDashboard(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();

    // optional real-time feel
    const interval = setInterval(fetchDashboard, 5000);
    return () => clearInterval(interval);
  }, []);

 const months = [
   "Jan",
   "Feb",
   "Mar",
   "Apr",
   "May",
   "Jun",
   "Jul",
   "Aug",
   "Sep",
   "Oct",
   "Nov",
   "Dec",
 ];

 const fullRevenueData = months.map((month, index) => {
   const found = dashboard?.bookings?.revenueChart?.find(
     (item) => item._id === index + 1,
   );

   return {
     month,
     revenue: found ? found.revenue : 0,
   };
 });

 const rate = dashboard?.properties?.occupancyRate || 0;

 const color =
   rate > 80
     ? "text-green-600"
     : rate > 50
       ? "text-yellow-500"
       : "text-red-500";

  const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"];

  const propertyTypeData =
    dashboard?.properties?.typeDistribution?.map((item, index) => ({
      name: item._id || "Other",
      value: item.value,
      color: COLORS[index % COLORS.length],
    })) || [];     


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's an overview of your rental properties.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Properties
            </CardTitle>
            <Building2 className="size-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboard?.properties?.total || 0}
            </div>
            <p className="text-xs text-gray-600 mt-1">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Tenants
            </CardTitle>
            <Users className="size-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboard?.bookings?.totalTenants || 0}
            </div>
            <p className="text-xs text-gray-600 mt-1">92% occupancy rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="size-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${dashboard?.revenue?.monthly || 0}
            </div>
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <TrendingUp className="size-3 mr-1" />
              +12.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Issues
            </CardTitle>
            <AlertCircle className="size-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboard?.maintenance?.pending || 0}
            </div>
            <p className="text-xs text-gray-600 mt-1">2 maintenance requests</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={fullRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Occupancy Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-[200px]">
              <h2 className={`text-5xl font-bold ${color}`}>
                {dashboard?.properties?.occupancyRate || 0}%
              </h2>

              <p className="text-gray-600 mt-2">
                {dashboard?.properties?.occupiedUnits || 0} /{" "}
                {dashboard?.properties?.totalUnits || 0} units occupied
              </p>

              {/* Progress bar (optional 🔥) */}
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${dashboard?.properties?.occupancyRate || 0}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Property Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={propertyTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {propertyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} properties`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {propertyTypeData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div
                      className="size-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 pb-4 border-b last:border-b-0 last:pb-0"
                >
                  <div className="mt-1">
                    {activity.action === "New Tenant" && (
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <KeyRound className="size-4 text-blue-600" />
                      </div>
                    )}
                    {activity.action === "Maintenance Request" && (
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Waves className="size-4 text-orange-600" />
                      </div>
                    )}
                    {activity.action === "Payment Received" && (
                      <div className="p-2 bg-green-100 rounded-lg">
                        <DollarSign className="size-4 text-green-600" />
                      </div>
                    )}
                    {activity.action === "Lease Renewal" && (
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Home className="size-4 text-purple-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.property}
                    </p>
                    <p className="text-sm text-gray-600">
                      {activity.action}: {activity.tenant}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {activity.date}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
