import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";

import {
  Dumbbell,
  Waves,
  Briefcase,
  Film,
  Bed,
  Clock,
  Users,
  Calendar as CalendarIcon,
  CheckCircle2,
} from "lucide-react";

import { amenities, bookings } from "../../components/data/mockData";
import { toast } from "sonner";

// ✅ FIXED (removed TS type)
const iconMap = {
  dumbbell: Dumbbell,
  waves: Waves,
  briefcase: Briefcase,
  film: Film,
  bed: Bed,
  palmtree: Users,
};

export function TenantAmenities() {
  // ✅ FIXED (removed <any>)
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleBooking = () => {
    if (!bookingDate || !bookingTime) {
      toast.error("Please select both date and time");
      return;
    }

    toast.success(
      `Successfully booked ${selectedAmenity?.name} for ${bookingDate} at ${bookingTime}`,
    );

    setIsDialogOpen(false);
    setBookingDate("");
    setBookingTime("");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Amenities</h1>
        <p className="text-gray-600 mt-1">Book and manage building amenities</p>
      </div>

      {/* Current Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Your Bookings</CardTitle>
        </CardHeader>

        <CardContent>
          {bookings.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 bg-gray-50 rounded-lg border"
                >
                  <p className="font-medium">{booking.amenityName}</p>

                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <CalendarIcon className="size-4" />
                    {new Date(booking.date).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                    <Clock className="size-4" />
                    {booking.time}
                  </div>

                  <Badge
                    className={
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-700 mt-2"
                        : "bg-yellow-100 text-yellow-700 mt-2"
                    }
                  >
                    {booking.status}
                  </Badge>

                  <Button variant="outline" size="sm" className="w-full mt-3">
                    Cancel Booking
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No current bookings
            </p>
          )}
        </CardContent>
      </Card>

      {/* Amenities List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Amenities</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenities.map((amenity) => {
            const IconComponent = iconMap[amenity.icon] || Users;

            return (
              <Card
                key={amenity.id}
                className={!amenity.available ? "opacity-60" : ""}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between mb-4">
                    <IconComponent className="size-6 text-blue-600" />

                    <Badge
                      className={
                        amenity.available
                          ? "bg-green-500 text-white"
                          : "bg-gray-300"
                      }
                    >
                      {amenity.available ? "Available" : "Unavailable"}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-lg">{amenity.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {amenity.description}
                  </p>

                  <p className="text-sm text-gray-600">{amenity.hours}</p>

                  <p className="text-sm text-gray-600 mb-4">
                    Capacity: {amenity.capacity}
                  </p>

                  {/* Dialog */}
                  <Dialog
                    open={isDialogOpen && selectedAmenity?.id === amenity.id}
                    onOpenChange={setIsDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        className="w-full"
                        disabled={!amenity.available}
                        onClick={() => setSelectedAmenity(amenity)}
                      >
                        Book Now
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Book {amenity.name}</DialogTitle>
                      </DialogHeader>

                      <div className="space-y-4 pt-4">
                        <div>
                          <Label htmlFor="date">Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="time">Time</Label>
                          <Input
                            id="time"
                            type="time"
                            value={bookingTime}
                            onChange={(e) => setBookingTime(e.target.value)}
                          />
                        </div>

                        <Button onClick={handleBooking} className="w-full">
                          Confirm Booking
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
