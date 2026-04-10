import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  Plus,
  Search,
  MapPin,
  Home,
  DollarSign,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";

export  default function Properties() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [properties, setProperties] = useState([]);

  // Fetch from backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/property");
        setProperties(res.data);
      } catch (err) {
        console.error("Error fetching properties", err);
      }
    };

    fetchProperties();
  }, []);

  // Filter
  const filteredProperties = properties.filter(
    (property) =>
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Status color
  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700";
      case "occupied":
        return "bg-blue-100 text-blue-700";
      case "maintenance":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Properties</h2>
          <p className="text-slate-500 mt-1"> Your rental properties</p>
        </div>
      </div>

      {/* Search + List */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <Input
                placeholder="Search properties..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProperties.map((property) => (
              <Card
                key={property._id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  {/* Top */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Home className="text-blue-600" size={24} />
                    </div>

                    <Badge className={getStatusColor(property.status)}>
                      {property.status}
                    </Badge>
                  </div>

                  {/* Name */}
                  <h3 className="font-bold text-lg text-slate-900 mb-2">
                    {property.title}
                  </h3>

                  {/* Info */}
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Home size={16} className="text-slate-400" />
                      <span>
                        {property.bedrooms} Bed, {property.bathrooms} Bath
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-slate-400" />
                      <span>
                        {property.address}, {property.city}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-slate-400" />
                      <span>
                        ₹{property.price?.toLocaleString()} /
                        {property.paymentFrequency}
                      </span>
                    </div>
                  </div>

                  {/* Occupancy */}
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Occupancy</span>
                      <span className="font-medium">
                        {property.occupied}/{property.units}
                      </span>
                    </div>

                    <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (property.occupied / property.units) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    {/* View */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        navigate(`/tenant/properties/${property._id}`)
                      }
                    >
                      <Eye size={14} />
                      View
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
