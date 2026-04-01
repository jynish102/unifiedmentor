import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Plus, Search, MapPin, Home, DollarSign } from "lucide-react";
import { useState, useEffect, } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Api from "../../utils/api";

export function Properties() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [properties, setProperties] = useState([]);
  

  // ✅ Fetch from backend
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

  // ✅ Filter
  const filteredProperties = properties.filter(
    (property) =>
      property.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ✅ Status color
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
          <p className="text-slate-500 mt-1">Manage your rental properties</p>
        </div>

        <Button className="gap-2">
          <Plus size={18} />
          Add Property
        </Button>
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
                  {/* <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Home className="text-blue-600" size={24} />
                    </div>

                    <Badge className={getStatusColor(property.status)}>
                      {property.status}
                    </Badge>
                  </div> */}
                  {/* Image */}
                  <div className="w-full h-40 mb-4 rounded-lg overflow-hidden bg-gray-200">
                    <img
                      src={
                        property.images?.[0]
                          ? `http://localhost:5000/uploads/${property.images[0]}`
                          : "https://via.placeholder.com/400"
                      }
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

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
                      <MapPin size={16} className="text-slate-400" />
                      <span>{property.address}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-slate-400" />
                      <span>{property.city}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Home size={16} className="text-slate-400" />
                      <span>{property.propertyType}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-slate-400" />
                      <span>₹{property.price?.toLocaleString()}</span>
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

                  {/* Button */}
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    size="sm"
                    onClick={() =>
                      navigate(`/admin/properties/${property._id}`)
                    }
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
