import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Plus, Search, MapPin, Clock, Users } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export function Amenities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [amenities, setAmenities] = useState([]);

  // ✅ Fetch Amenities
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/amenity");
        setAmenities(res.data.data || []); // important fix
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
      amenity.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ✅ Status Color
  const getStatusColor = (status) => {
    return status === "active"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Amenities</h2>
          <p className="text-slate-500 mt-1">Manage property amenities</p>
        </div>

        <Button className="gap-2">
          <Plus size={18} />
          Add Amenity
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="relative max-w-md">
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
        </CardHeader>

        <CardContent>
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAmenities.map((amenity) => (
              <Card
                key={amenity._id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  {/* Top */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">🏢</div>

                    <Badge className={getStatusColor(amenity.status)}>
                      {amenity.status}
                    </Badge>
                  </div>

                  {/* Name */}
                  <h3 className="font-bold text-lg text-slate-900 mb-1">
                    {amenity.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 mb-3">
                    {amenity.description}
                  </p>

                  {/* Info */}
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      💰 <span>₹{amenity.price}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>Capacity: {amenity.capacity}</span>
                    </div>

                    {amenity.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>{amenity.location}</span>
                      </div>
                    )}

                    {amenity.operatingHours?.start && (
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>
                          {amenity.operatingHours.start} -{" "}
                          {amenity.operatingHours.end}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Image */}
                  {amenity.images?.length > 0 && (
                    <img
                      src={amenity.images[0]}
                      alt={amenity.name}
                      className="mt-3 h-32 w-full object-cover rounded"
                    />
                  )}

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button size="sm">Book Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredAmenities.length === 0 && (
            <p className="text-center text-slate-500 mt-6">
              No amenities found
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
