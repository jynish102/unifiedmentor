import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import API from "../../utils/api";

export default function BookingRequests() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        let res;

        if (activeTab === "property") {
          res = await API.get("/property-bookings");

          // add type manually
          const data = res.data.data.map((b) => ({
            ...b,
            type: "property",
          }));

          setBookings(data);
        } else if (activeTab === "amenity") {
          res = await API.get("/amenity-bookings");

          const data = res.data.data.map((b) => ({
            ...b,
            type: "amenity",
          }));

          setBookings(data);
        } else {
          // ALL → call both APIs
          const [propertyRes, amenityRes] = await Promise.all([
            API.get("/property-bookings"),
            API.get("/amenity-bookings"),
          ]);

          const propertyData = propertyRes.data.data.map((b) => ({
            ...b,
            type: "property",
          }));

          const amenityData = amenityRes.data.data.map((b) => ({
            ...b,
            type: "amenity",
          }));

          setBookings([...propertyData, ...amenityData]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchBookings();
  }, [activeTab]);

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  const propertyCount = bookings.filter((b) => b.type === "property").length;

  const amenityCount = bookings.filter((b) => b.type === "amenity").length;
   
  const handleStatusChange = async (id, type, status) => {
    try {
      let url =
        type === "property"
          ? `/property-bookings/${id}/status`
          : `/amenity-bookings/${id}/status`;
      const token = localStorage.getItem("token");    

      await API.put(url, { status }, 
        {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // update UI instantly
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status } : b)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Booking Registry</h2>
        <p className="text-slate-500 mt-1">
          Review and manage all property and amenity reservations
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white">
          <CardContent className="p-6">
            <p className="text-sm text-slate-500">Pending Approval</p>
            <h3 className="text-2xl font-bold mt-2">{pendingCount}</h3>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <p className="text-sm text-slate-500">Properties</p>
            <h3 className="text-2xl font-bold mt-2">{propertyCount}</h3>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <p className="text-sm text-slate-500">Amenities</p>
            <h3 className="text-2xl font-bold mt-2">{amenityCount}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-white">
        <CardHeader>
          <div className="relative max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <Input
              placeholder="Search bookings..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>

        {/* Tabs */}
        <div className="flex gap-2">
          {["all", "property", "amenity"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              className={`capitalize ${
                activeTab === tab
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "all"
                ? "All Bookings"
                : tab === "property"
                  ? "Properties"
                  : "Amenities"}
            </Button>
          ))}
        </div>

        {/* Cards */}
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {bookings.map((b) => (
              <Card key={b._id} className="bg-white border">
                <CardContent className="p-6 space-y-4">
                  {/* Top badges */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Badge className="bg-slate-100 text-slate-700">
                        {b.type.toUpperCase()}
                      </Badge>

                      <Badge className={getStatusColor(b.status)}>
                        {b.status.toUpperCase()}
                      </Badge>
                    </div>

                    <span className="text-sm text-slate-500">{b._id}</span>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {b.type === "property"
                        ? b.property?.title
                        : b.amenity?.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {b.user?.fullname || b.user}
                    </p>
                  </div>

                  {/* Info */}
                  <div className="grid grid-cols-2 text-sm text-slate-600 gap-2">
                    <div>
                      <p className="text-slate-400">DATE & TIME</p>
                      <p>{new Date(b.date).toLocaleDateString()}</p>
                    </div>

                    <div>
                      <p className="text-slate-400">DURATION</p>
                      <p>{b.duration}</p>
                      {b.guests && <p>{b.guests}</p>}
                    </div>
                  </div>

                  {/* Notes */}
                  {b.notes && (
                    <div className="text-sm text-slate-600">
                      <p className="text-slate-400">NOTES</p>
                      <p>{b.notes}</p>
                    </div>
                  )}

                  {/* Buttons (Always visible as you requested) */}
                  <div className="flex gap-2 pt-2">
                  {b.status === "pending" && (
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() =>
                        handleStatusChange(b._id, b.type, "approved")
                      }
                    >
                      Approve
                    </Button>
                  )}

                  {b.status === "pending" && (
                    <Button
                      variant="outline"
                      className="flex-1 text-red-600 border-red-200"
                      onClick={() =>
                        handleStatusChange(b._id, b.type, "rejected")
                      }
                    >
                      Reject
                    </Button>
                  )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
