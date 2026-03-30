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

const revenueData = [
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 52000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 61000 },
  { month: "May", revenue: 55000 },
  { month: "Jun", revenue: 67000 },
];

const occupancyData = [
  { month: "Jan", rate: 85 },
  { month: "Feb", rate: 90 },
  { month: "Mar", rate: 88 },
  { month: "Apr", rate: 92 },
  { month: "May", rate: 87 },
  { month: "Jun", rate: 95 },
];

const propertyTypeData = [
  { name: "Apartments", value: 12, color: "#3b82f6" },
  { name: "Houses", value: 8, color: "#8b5cf6" },
  { name: "Commercial", value: 5, color: "#ec4899" },
];

const recentActivity = [
  {
    id: 1,
    property: "Sunset Apartments #302",
    action: "New Tenant",
    tenant: "Sarah Johnson",
    date: "2 hours ago",
  },
  {
    id: 2,
    property: "Ocean View Villa",
    action: "Maintenance Request",
    tenant: "Pool cleaning needed",
    date: "5 hours ago",
  },
  {
    id: 3,
    property: "Downtown Loft #12",
    action: "Payment Received",
    tenant: "$2,500",
    date: "1 day ago",
  },
  {
    id: 4,
    property: "Garden Apartments #105",
    action: "Lease Renewal",
    tenant: "Michael Chen",
    date: "2 days ago",
  },
];

export  function OwnerDashboard() {
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
            <div className="text-2xl font-bold">25</div>
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
            <div className="text-2xl font-bold">23</div>
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
            <div className="text-2xl font-bold">$67,000</div>
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
            <div className="text-2xl font-bold">3</div>
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
              <LineChart data={revenueData}>
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
            <CardTitle>Occupancy Rate (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                {/* <Tooltip formatter={(value) => `${value}%`} /> */}
                <Tooltip
                  formatter={(value) => `$${Number(value).toLocaleString()}`}
                />
                <Bar dataKey="rate" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
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
                <Tooltip />
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
