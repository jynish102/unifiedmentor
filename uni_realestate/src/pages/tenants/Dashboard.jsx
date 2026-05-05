import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Calendar, Wrench, Bell, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import  API from "../../utils/api";



export function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get("/tenant/dashboard");
      setDashboard(res.data);
    };

    fetchData();
  }, []);
  console.log(dashboard);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back,{" "}
          {dashboard?.tenant?.fullname ? dashboard.tenant.fullname : "User"}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your rental
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Bookings */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming Bookings</p>
                <p className="text-2xl font-bold mt-1">
                  {dashboard?.stats?.totalBookings}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Active reservations
                </p>
              </div>
              <div className="size-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="size-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold mt-1">
                  {dashboard?.stats?.openMaintenance}
                </p>
                <p className="text-xs text-gray-500 mt-1">Open requests</p>
              </div>
              <div className="size-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Wrench className="size-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lease */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Lease Status</p>
                <p className="text-2xl font-bold mt-1">Active</p>
                <p className="text-xs text-gray-500 mt-1">
                  Until{" "}
                  {dashboard?.stats?.leaseStatus?.leaseEnd
                    ? new Date(
                        dashboard.stats.leaseStatus.leaseEnd,
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div className="size-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="size-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bookings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming Bookings</CardTitle>
              <Link to="/tenant/amenities">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="size-4 ml-2" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent>
              {dashboard?.bookings?.length > 0 ? (
                <div className="space-y-4">
                  {dashboard?.bookings?.map((booking) => (
                    <div
                      key={booking._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {" "}
                          {booking.property?.title || "Property"}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(booking.startDate).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}{" "}
                          →{" "}
                          {new Date(booking.endDate).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>

                      <Badge className="bg-green-100 text-green-700">
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No bookings</p>
              )}
            </CardContent>
          </Card>

          {/* Maintenance */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Maintenance</CardTitle>
              <Link to="/tenant/maintenance">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="size-4 ml-2" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent>
              {dashboard?.maintenance?.length > 0 ? (
                dashboard.maintenance.map((request) => (
                  <div
                    key={request._id}
                    className="p-4 bg-gray-50 rounded-lg mb-3"
                  >
                    <p className="font-medium">{request.title}</p>
                    <p className="text-sm text-gray-600">
                      {request.description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No maintenance requests
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* Announcements */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="size-5" />
                Announcements
              </CardTitle>
            </CardHeader>

            <CardContent>
              {announcements.map((a) => (
                <div key={a.id} className="mb-3">
                  <p className="font-medium">{a.title}</p>
                  <p className="text-sm text-gray-600">{a.message}</p>
                </div>
              ))}
            </CardContent>
          </Card> */}

          {/* Property */}
          <Card>
            <CardHeader>
              <CardTitle>Property Info</CardTitle>
            </CardHeader>

            <CardContent>
              <p>Title: {dashboard?.property?.title}</p>
              <p>Address: {dashboard?.property?.address}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
