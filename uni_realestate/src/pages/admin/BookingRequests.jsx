import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export default function BookingRequests() {
  const [search, setSearch] = useState("");
   const [activeTab, setActiveTab] = useState("all");

  // Dummy data (replace with API later)
  const bookings = [
    {
      id: "BK-2847",
      type: "property",
      status: "approved",
      title: "Oceanview Villa",
      user: "Sarah Mitchell",
      date: "Apr 18, 2026",
      time: "3:00 PM",
      duration: "3 nights",
      guests: "4 guests",
      notes: "Anniversary celebration",
    },
    {
      id: "BK-2846",
      type: "amenity",
      status: "rejected",
      title: "Tennis Court",
      user: "James Chen",
      date: "Apr 15, 2026",
      time: "10:00 AM",
      duration: "2 hours",
    },
  ];

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

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Booking Registry</h2>
        <p className="text-slate-500 mt-1">
          Review and manage all property and amenity reservations
        </p>
      </div>

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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white">
          <CardContent className="p-6">
            <p className="text-sm text-slate-500">Pending Approval</p>
            <h3 className="text-2xl font-bold mt-2">2</h3>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <p className="text-sm text-slate-500">Properties</p>
            <h3 className="text-2xl font-bold mt-2">4</h3>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <p className="text-sm text-slate-500">Amenities</p>
            <h3 className="text-2xl font-bold mt-2">4</h3>
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

        {/* Cards */}
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {bookings.map((b) => (
              <Card key={b.id} className="bg-white border">
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

                    <span className="text-sm text-slate-500">{b.id}</span>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {b.title}
                    </h3>
                    <p className="text-sm text-slate-500">{b.user}</p>
                  </div>

                  {/* Info */}
                  <div className="grid grid-cols-2 text-sm text-slate-600 gap-2">
                    <div>
                      <p className="text-slate-400">DATE & TIME</p>
                      <p>{b.date}</p>
                      <p>{b.time}</p>
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
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 text-red-600 border-red-200"
                    >
                      Reject
                    </Button>
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
