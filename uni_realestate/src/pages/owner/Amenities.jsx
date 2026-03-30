import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Plus,
  Waves,
  Dumbbell,
  Wifi,
  Car,
  ShieldCheck,
  Zap,
  Trees,
  UtensilsCrossed,
  Tv,
  Wind,
  WashingMachine,
  Calendar,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Progress } from "../../components/ui/progress";

const amenities = [
  {
    id: 1,
    name: "Swimming Pool",
    icon: Waves,
    properties: 8,
    totalProperties: 25,
    status: "operational",
    maintenanceDate: "2026-04-15",
    cost: 450,
    description: "Heated outdoor pool with spa",
  },
  {
    id: 2,
    name: "Fitness Center",
    icon: Dumbbell,
    properties: 12,
    totalProperties: 25,
    status: "operational",
    maintenanceDate: "2026-04-05",
    cost: 320,
    description: "24/7 gym with modern equipment",
  },
  {
    id: 3,
    name: "High-Speed WiFi",
    icon: Wifi,
    properties: 25,
    totalProperties: 25,
    status: "operational",
    maintenanceDate: "2026-05-01",
    cost: 150,
    description: "Fiber optic internet included",
  },
  {
    id: 4,
    name: "Parking Garage",
    icon: Car,
    properties: 20,
    totalProperties: 25,
    status: "operational",
    maintenanceDate: "2026-06-10",
    cost: 280,
    description: "Covered parking with EV charging",
  },
  {
    id: 5,
    name: "Security System",
    icon: ShieldCheck,
    properties: 25,
    totalProperties: 25,
    status: "maintenance",
    maintenanceDate: "2026-03-28",
    cost: 520,
    description: "24/7 surveillance and access control",
  },
  {
    id: 6,
    name: "Laundry Facilities",
    icon: WashingMachine,
    properties: 15,
    totalProperties: 25,
    status: "operational",
    maintenanceDate: "2026-04-20",
    cost: 180,
    description: "Coin-operated washers and dryers",
  },
  {
    id: 7,
    name: "Central AC/Heating",
    icon: Wind,
    properties: 25,
    totalProperties: 25,
    status: "operational",
    maintenanceDate: "2026-09-01",
    cost: 380,
    description: "Climate control system",
  },
  {
    id: 8,
    name: "Rooftop Terrace",
    icon: Trees,
    properties: 6,
    totalProperties: 25,
    status: "operational",
    maintenanceDate: "2026-05-15",
    cost: 220,
    description: "Community outdoor space",
  },
  {
    id: 9,
    name: "Smart Home System",
    icon: Zap,
    properties: 10,
    totalProperties: 25,
    status: "operational",
    maintenanceDate: "2026-04-30",
    cost: 290,
    description: "IoT enabled controls",
  },
];

const upcomingMaintenance = [
  {
    id: 1,
    amenity: "Security System",
    property: "All Properties",
    date: "2026-03-28",
    status: "scheduled",
    priority: "high",
  },
  {
    id: 2,
    amenity: "Fitness Center",
    property: "Downtown Complex",
    date: "2026-04-05",
    status: "scheduled",
    priority: "medium",
  },
  {
    id: 3,
    amenity: "Swimming Pool",
    property: "Sunset Apartments",
    date: "2026-04-15",
    status: "scheduled",
    priority: "medium",
  },
];

export  function Amenities() {
  const getStatusIcon = (status) => {
    return status === "operational" ? (
      <CheckCircle className="size-4 text-green-600" />
    ) : (
      <AlertCircle className="size-4 text-orange-600" />
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Amenities</h2>
          <p className="text-gray-600 mt-1">
            Manage property amenities and facilities
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="size-4 mr-2" />
          Add Amenity
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Amenities</p>
              <p className="text-3xl font-bold mt-2">{amenities.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Operational</p>
              <p className="text-3xl font-bold mt-2 text-green-600">
                {amenities.filter((a) => a.status === "operational").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Under Maintenance</p>
              <p className="text-3xl font-bold mt-2 text-orange-600">
                {amenities.filter((a) => a.status === "maintenance").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Monthly Cost</p>
              <p className="text-3xl font-bold mt-2 text-purple-600">
                $
                {amenities.reduce((sum, a) => sum + a.cost, 0).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Amenities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {amenities.map((amenity) => {
          const Icon = amenity.icon;
          const percentage = Math.round(
            (amenity.properties / amenity.totalProperties) * 100,
          );

          return (
            <Card
              key={amenity.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Icon className="size-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{amenity.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {amenity.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <div className="flex items-center space-x-2">
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

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Coverage:</span>
                    <span className="font-medium">
                      {amenity.properties}/{amenity.totalProperties} properties
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Monthly Cost:</span>
                  <span className="font-medium">${amenity.cost}</span>
                </div>

                <div className="flex items-center justify-between text-sm pt-2 border-t">
                  <span className="text-gray-600">Next Maintenance:</span>
                  <span className="font-medium flex items-center">
                    <Calendar className="size-3 mr-1" />
                    {new Date(amenity.maintenanceDate).toLocaleDateString()}
                  </span>
                </div>

                <Button variant="outline" className="w-full" size="sm">
                  Manage
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upcoming Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Maintenance Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingMaintenance.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                    <h4 className="font-medium text-gray-900">
                      {item.amenity}
                    </h4>
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{item.property}</p>
                </div>
                <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="size-4 mr-1" />
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
