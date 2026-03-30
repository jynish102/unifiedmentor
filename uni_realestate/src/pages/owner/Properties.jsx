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
} from "lucide-react";
import { ImageWithFallback } from "../../components/ui/imageWithFallback";
import { useState } from "react";

const properties = [
  {
    id: 1,
    name: "Sunset Apartments #302",
    address: "123 Ocean Drive, Miami, FL",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    rent: 2500,
    status: "occupied",
    tenant: "Sarah Johnson",
    image: "modern apartment interior",
  },
  {
    id: 2,
    name: "Ocean View Villa",
    address: "456 Beach Road, Malibu, CA",
    type: "House",
    bedrooms: 4,
    bathrooms: 3,
    rent: 6500,
    status: "occupied",
    tenant: "Michael Chen",
    image: "luxury beach villa",
  },
  {
    id: 3,
    name: "Downtown Loft #12",
    address: "789 Main Street, New York, NY",
    type: "Loft",
    bedrooms: 1,
    bathrooms: 1,
    rent: 3200,
    status: "vacant",
    tenant: null,
    image: "modern loft apartment",
  },
  {
    id: 4,
    name: "Garden Apartments #105",
    address: "321 Park Avenue, Seattle, WA",
    type: "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    rent: 2800,
    status: "occupied",
    tenant: "Emily Rodriguez",
    image: "apartment with garden view",
  },
  {
    id: 5,
    name: "Riverside Condo",
    address: "555 River Road, Portland, OR",
    type: "Condo",
    bedrooms: 2,
    bathrooms: 2,
    rent: 2400,
    status: "maintenance",
    tenant: "James Wilson",
    image: "riverside condo interior",
  },
  {
    id: 6,
    name: "Suburban Family Home",
    address: "888 Maple Street, Austin, TX",
    type: "House",
    bedrooms: 4,
    bathrooms: 3,
    rent: 3500,
    status: "occupied",
    tenant: "The Martinez Family",
    image: "suburban family house",
  },
];

export  function Properties() {
  const [searchTerm, setSearchTerm] = useState("");

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
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Properties</h2>
          <p className="text-gray-600 mt-1">Manage your rental properties</p>
        </div>
        <Button className="w-full sm:w-auto">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card
            key={property.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48 bg-gray-200">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"
                alt={property.name}
                className="w-full h-full object-cover"
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
                  <CardTitle className="text-lg">{property.name}</CardTitle>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="size-3 mr-1" />
                    {property.address}
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
                <span className="font-medium">{property.type}</span>
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
                  <DollarSign className="size-3" />
                  {property.rent.toLocaleString()}
                </span>
              </div>

              {property.tenant ? (
                <div className="flex items-center justify-between text-sm pt-2 border-t">
                  <span className="text-gray-600">Tenant:</span>
                  <span className="font-medium flex items-center">
                    <Users className="size-3 mr-1" />
                    {property.tenant}
                  </span>
                </div>
              ) : (
                <div className="pt-2 border-t">
                  <Button className="w-full" size="sm">
                    Find Tenant
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

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
                .reduce((sum, p) => sum + p.rent, 0)
                .toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
