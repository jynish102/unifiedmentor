import { User, Home, CreditCard, Calendar, FileText, Phone, Mail, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useEffect, useState } from "react";
import API from "../../utils/api";
export default function TenantProfile() {
  const [tenants, setTenants] = useState([]);
  const [tenant, setTenant] = useState(null);
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const res = await API.get("/tenants");
        setTenants(res.data.tenants);
        setTenant(res.data.tenants[0]); //  important
        setCounts(res.data.counts);
      } catch (error) {
        console.error("Error fetching tenant data:", error);
      }
    };

    fetchTenantData();
  }, []);

  if (!tenant) {
    return <div className="min-h-screen bg-muted/30">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-primary/10 to-primary/5"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16">
              <img
                src={tenant.profileImage}
                alt={tenant.name}
                className="w-32 h-32 rounded-full border-4 border-card object-cover shadow-md"
              />
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h1 className="text-foreground">{tenant.name}</h1>
                    <p className="text-muted-foreground">Tenant since {tenant.joinDate}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full w-fit">
                    <CheckCircle className="w-4 h-4" />
                    {tenant.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-primary" />
                <h2 className="text-foreground">Personal Information</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="text-foreground">{tenant.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="text-foreground">{tenant.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Rental */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Home className="w-5 h-5 text-primary" />
                <h2 className="text-foreground">Current Rental</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-foreground">{tenant.units}</p>
                    <p className="text-muted-foreground">{tenant.address}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-muted-foreground">Move-in Date</p>
                    <p className="text-foreground">{tenant.moveInDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Lease End</p>
                    <p className="text-foreground">{tenant.leaseEnd}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly Rent</p>
                    <p className="text-foreground">{tenant.rentAmount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Security Deposit</p>
                    <p className="text-foreground">{tenant.securityDeposit}</p>
                  </div>
                </div>
              </div>
            </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Amenity Access */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="text-foreground">Amenity Access</h2>
              </div>
              <div className="space-y-3">
                {tenant?.amenities?.map((amenity) => (
                  <div key={amenity.id} className="p-3 bg-muted/30 rounded-lg border border-border">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-foreground">{amenity.name}</p>
                      <span className={`px-2 py-0.5 rounded-full text-sm ${
                        amenity.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {amenity.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <p>{amenity.lastUsed}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-primary" />
                <h2 className="text-foreground">Emergency Contact</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="text-foreground">{tenant.emergencyContact.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Relationship</p>
                  <p className="text-foreground">{tenant.emergencyContact.relationship}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="text-foreground">{tenant.emergencyContact.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="text-foreground">{tenant.emergencyContact.email}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <h3 className="text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  Edit Profile
                </button>
              
      
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
