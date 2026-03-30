import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";

import { MapPin, Calendar, Mail, Shield } from "lucide-react";

import { tenantData } from "../../components/data/mockData";
import { toast } from "sonner";

export function Profile() {
  const handleSave = () => {
    toast.success("Profile updated successfully");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input defaultValue={tenantData.name.split(" ")[0]} />
                <Input defaultValue={tenantData.name.split(" ")[1]} />
              </div>

              <Input type="email" defaultValue={tenantData.email} />
              <Input type="tel" defaultValue={tenantData.phone} />

              <Button onClick={handleSave}>Save Changes</Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Maintenance Updates</span>
                <Switch defaultChecked />
              </div>

              <div className="flex justify-between">
                <span>Amenity Confirmations</span>
                <Switch defaultChecked />
              </div>

              <div className="flex justify-between">
                <span>Announcements</span>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Input type="password" placeholder="Current Password" />
              <Input type="password" placeholder="New Password" />
              <Input type="password" placeholder="Confirm Password" />

              <Button variant="outline">Update Password</Button>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="size-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                {tenantData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>

              <h3 className="font-semibold text-xl">{tenantData.name}</h3>
              <p className="text-gray-600">{tenantData.email}</p>

              <Badge className="mt-3 bg-green-100 text-green-700">
                Active Tenant
              </Badge>
            </CardContent>
          </Card>

          {/* Lease Info */}
          <Card>
            <CardHeader>
              <CardTitle>Lease Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <p>Unit: {tenantData.unit}</p>
              <p>Building: {tenantData.building}</p>
              <p>
                Lease: {new Date(tenantData.leaseStart).toLocaleDateString()} -{" "}
                {new Date(tenantData.leaseEnd).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => toast.info("Lease opened")}
              >
                <Calendar className="size-4 mr-2" />
                View Lease
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => toast.info("Downloaded")}
              >
                <Shield className="size-4 mr-2" />
                Insurance
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => toast.info("Contact opened")}
              >
                <Mail className="size-4 mr-2" />
                Contact
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ✅ FIXED Badge (NO TypeScript)
function Badge({ children, className }) {
  return (
    <span className={`px-3 py-1 rounded-full text-sm ${className}`}>
      {children}
    </span>
  );
}
