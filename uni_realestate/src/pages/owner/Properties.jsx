import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Building2,
  MapPin,
  DollarSign,
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { ImageWithFallback } from "../../components/ui/imageWithFallback";
import { useState, useEffect } from "react";
import API from "../../utils/api";
import { useNavigate } from "react-router-dom";




export  default function Properties() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [properties, setProperties] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

   const getImageUrl = (img) => {
     if (!img) return "/default-image.jpg";
     return `http://localhost:5000/${img.replace(/\\/g, "/")}`;
   };

  // Fetch from backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await API.get("/property/my-properties", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProperties(res.data.data);
      } catch (err) {
        console.error("Error fetching properties", err);
      }
    };

    fetchProperties();
  }, []);

  

  const getStatusColor = (status) => {
    switch (status) {
      case "occupied":
        return "bg-green-100 text-green-700";
      case "vacant":
        return "bg-yellow-100 text-yellow-700";
      case "maintenance":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()),
  );

   const handleDelete = async (id) => {
     const confirmDelete = window.confirm("Are you sure?");

     if (!confirmDelete) return;

     try {
       const token = localStorage.getItem("token");

       await API.delete(`/property/${id}`, {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       });

       // remove from UI
       setProperties((prev) => prev.filter((p) => p._id !== id));

       alert("Deleted successfully ");
     } catch (err) {
       console.error(err);
       alert("Delete failed ");
     }
   };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Properties</h2>
          <p className="text-gray-600 mt-1">Manage your rental properties</p>
        </div>
        <Button
          className="w-full sm:w-auto"
          onClick={() => navigate("/owner/properties/add-property")}
        >
          <Plus className="size-4 mr-2" />
          Add Property
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="size-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>
      { filteredProperties.length === 0 ? (
  <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
    <p className="text-5xl mb-3">🏠</p>

    <h2 className="text-xl font-semibold text-gray-700">
      No Properties Found
    </h2>

    <p className="text-gray-500 mt-2">
      You haven’t added any properties yet.
    </p>

     <Button
      className="mt-4"
      onClick={() => navigate("/owner/properties/add-property")}
    >
      <Plus className="size-4 mr-2" />
      Add Property
    </Button>
  </div>
) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card
            key={property._id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48 bg-gray-200">
              <ImageWithFallback
                src={getImageUrl(selectedImage || property.images?.[0])}
                alt={property.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/default-image.jpg";
                }}
              />
              <Badge
                className={`absolute top-3 right-3 ${getStatusColor(property.status)}`}
              >
                {property.status}
              </Badge>
            </div>

            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{property.title}</CardTitle>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="size-3 mr-1" />
                    {property.address},{property.city}
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="ml-2">
                  <MoreVertical className="size-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{property.propertyType}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Bed/Bath:</span>
                <span className="font-medium">
                  {property.bedrooms}BD / {property.bathrooms}BA
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Monthly Rent:</span>
                <span className="font-medium text-green-600 flex items-center">
                  <DollarSign className="size-3" />₹
                  {property.price?.toLocaleString()} /
                  {property.paymentFrequency}
                </span>
              </div>

              <div className="flex gap-2 mt-4">
                {/* View */}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => navigate(`/owner/properties/${property._id}`)}
                >
                  <Eye size={14} />
                  View
                </Button>

                {/* Edit */}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    navigate(`/owner/properties/edit/${property._id}`)
                  }
                >
                  <Pencil size={14} />
                  Edit
                </Button>

                {/* Delete */}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDelete(property._id)}
                >
                  <Trash2 size={14} />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Properties</p>
            <p className="text-2xl font-bold mt-1">{properties.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Occupied</p>
            <p className="text-2xl font-bold mt-1">
              {properties.filter((p) => p.status === "occupied").length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Monthly Revenue</p>
            <p className="text-2xl font-bold mt-1">
              $
              {properties
                .filter((p) => p.status === "occupied")
                .reduce((sum, p) => sum + p.price, 0)
                .toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
