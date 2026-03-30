import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Plus, Search, Clock, Users, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export function Amenities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [amenities, setAmenities] = useState([]);

  // ✅ Fetch from backend
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/amenities");
        setAmenities(res.data);
      } catch (err) {
        console.error("Error fetching amenities", err);
      }
    };

    fetchAmenities();
  }, []);

  // ✅ Filter
  const filteredAmenities = amenities.filter(
    (amenity) =>
      amenity.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      amenity.type?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ✅ Status color
  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700";
      case "booked":
        return "bg-blue-100 text-blue-700";
      case "maintenance":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ✅ Icon logic (optional improvement)
  const getIconForType = (type) => {
    if (!type) return "🏢";

    const t = type.toLowerCase();
    if (t.includes("gym") || t.includes("fitness")) return "🏋️";
    if (t.includes("pool")) return "🏊";
    if (t.includes("movie")) return "🎬";
    if (t.includes("game")) return "🎮";
    if (t.includes("yoga")) return "🧘";
    return "🏢";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Amenities</h2>
          <p className="text-slate-500 mt-1">
            Manage property amenities and bookings
          </p>
        </div>

        <Button className="gap-2">
          <Plus size={18} />
          Add Amenity
        </Button>
      </div>

      {/* Search + Cards */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <Input
                placeholder="Search amenities..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAmenities.map((amenity) => (
              <Card
                key={amenity._id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  {/* Top */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">
                      {getIconForType(amenity.type)}
                    </div>

                    <Badge className={getStatusColor(amenity.availability)}>
                      {amenity.availability}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-lg text-slate-900 mb-1">
                    {amenity.name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">{amenity.type}</p>

                  {/* Description */}
                  <p className="text-sm text-slate-600 mb-4">
                    {amenity.description}
                  </p>

                  {/* Info */}
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-slate-400" />
                      <span>{amenity.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-slate-400" />
                      <span>{amenity.operatingHours}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-slate-400" />
                      <span>Capacity: {amenity.capacity}</span>
                    </div>
                  </div>

                  {/* Booking Bar */}
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Bookings</span>
                      <span className="font-medium">
                        {amenity.bookings}/{amenity.capacity}
                      </span>
                    </div>

                    <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (amenity.bookings / amenity.capacity) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      View Bookings
                    </Button>
                    <Button size="sm">Book Now</Button>
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
