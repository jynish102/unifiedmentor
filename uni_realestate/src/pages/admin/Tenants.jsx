import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Plus, Search, Mail, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import API from "../../utils/api";

export function Tenants() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tenants, setTenants] = useState([]);
  const [counts, setCounts] = useState({
    total: 0,
    active: 0,
    expired: 0,
    upcoming: 0,
  });

  //  Fetch from backend
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await API.get("/tenants");
        setTenants(res.data.tenants || []);
        setCounts(res.data.counts || {});
      } catch (err) {
        console.error("Error fetching tenants", err);
      }
    };

    fetchTenants();
  }, []);

  // Filter
  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.unit?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ✅ Status color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "upcoming":
        return "bg-yellow-100 text-yellow-700";
      case "expired":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Tenants</h2>
          <p className="text-slate-500 mt-1">
            Manage tenant information and leases
          </p>
        </div>

        <Button className="gap-2">
          <Plus size={18} />
          Add Tenant
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <Input
                placeholder="Search tenants..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Unit / Property</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Lease Period</TableHead>
                  <TableHead>Monthly Rent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredTenants.map((tenant) => (
                  <TableRow key={tenant._id}>
                    {/* Name */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                          {tenant.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {tenant.name}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Unit */}
                    <TableCell>
                      <p className="font-medium text-slate-900">
                        {tenant.unit}
                      </p>
                      <p className="text-sm text-slate-500">
                        {tenant.property}
                      </p>
                    </TableCell>

                    {/* Contact */}
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail size={14} />
                          <span>{tenant.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone size={14} />
                          <span>{tenant.phone}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Lease */}
                    <TableCell>
                      <div className="text-sm">
                        <p className="text-slate-900">
                          {new Date(tenant.leaseStart).toLocaleDateString()}
                        </p>
                        <p className="text-slate-500">
                          to {new Date(tenant.leaseEnd).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>

                    {/* Rent */}
                    <TableCell>
                      <span className="font-medium">
                        ₹{tenant.rentAmount?.toLocaleString()}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge className={getStatusColor(tenant.status)}>
                        {tenant.status}
                      </Badge>
                    </TableCell>

                    {/* Action */}
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredTenants.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-6 text-slate-500"
                    >
                      No tenants found
                    </TableCell>
                  </TableRow>
                )}

                <div className="flex gap-4">
                  <div>Total: {counts.total}</div>
                  <div className="text-green-600">Active: {counts.active}</div>
                  <div className="text-yellow-600">
                    Upcoming: {counts.upcoming}
                  </div>
                  <div className="text-red-600">Expired: {counts.expired}</div>
                </div>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
