import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  Plus,
  Search,
  MapPin,
  Clock,
  Users,
  Pencil,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import API from "../../utils/api";

export default function Amenities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [amenities, setAmenities] = useState([]);
  const navigate = useNavigate();

  //  Fetch Amenities
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const res = await API.get("/amenity");
        setAmenities(res.data.data || []);
      } catch (err) {
        console.error("Error fetching amenities", err);
      }
    };

    fetchAmenities();
  }, []);

  // Filter
  const filteredAmenities = amenities.filter(
    (amenity) =>
      amenity.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      amenity.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusIcon = (status) => {
    return status === "operational" ? (
      <CheckCircle className="size-5 text-green-600 space-x-10" />
    ) : (
      <AlertCircle className="size-4 text-orange-600  space-x-2" />
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-orange-100 text-orange-700";
      case "low":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Amenities</h2>
          <p className="text-slate-500 mt-1">Property amenities</p>
        </div>
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
                    <div className="flex items-center gap-2">
                      {getStatusIcon(amenity.status)}
                      <Badge
                        className={
                          amenity.status === "operational"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }
                      >
                        {amenity.status}
                      </Badge>
                    </div>
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

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        navigate(`/tenant/amenities/${amenity._id}`)
                      }
                    >
                      <Eye size={14} />
                      View
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        navigate(`/tenant/maintenance/create/amenity/${amenity._id}`)
                      }
                    >
                      Report Issue
                    </Button>
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
