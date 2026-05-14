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
import toast from "react-hot-toast";

export default function Tenants() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tenants, setTenants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  // const [message, setMessage] = useState("");
  const [counts, setCounts] = useState({
    total: 0,
    active: 0,
    expired: 0,
    upcoming: 0,
  });

  const [form, setForm] = useState({
    subject: "",
    message: "",
  });


  //  Fetch from backend
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await API.get("/tenants/owner");
        console.log("API RESPONSE:", res.data);
        setTenants(res.data.tenants || []);
        setCounts(res.data.counts || {});
      } catch (err) {
        console.log("Error fetching tenants", err.res?.data || err.message);
        toast.error(
          err.response?.data?.message || "Failed To Fetch Tenant data",
        );
      }
    };
  console.log(tenants);
    fetchTenants();
  }, []);

  // Filter
  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.unit?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Status color
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

  //message modal
  const handleOpenModal = (tenant) => {
    setSelectedTenant(tenant);
    setIsModalOpen(true);
  };

  const handleSend = async () => {
    
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/messages/contact-tenant",
        {
          propertyId: selectedTenant.propertyId,
          subject: form.subject,
          message: form.message,
          tenantId: selectedTenant._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setForm({ subject: "", message: "" });
      setIsModalOpen(false);

      toast.success("Message sent");
    } catch (err) {
      console.log("Error", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to send message");
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">My Tenants</h2>
          <p className="text-slate-500 mt-1">
            Manage tenant information and leases
          </p>
        </div>
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
                  <TableHead>Property</TableHead>
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
                          {tenant.leaseStart
                            ? new Date(tenant.leaseStart).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "N/A"}
                        </p>
                        <p className="text-slate-500">
                          to{" "}
                          {tenant.leaseEnd
                            ? new Date(tenant.leaseEnd).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "N/A"}
                        </p>
                      </div>
                    </TableCell>

                    {/* Rent */}
                    <TableCell>
                      <span className="font-medium">
                        ₹{tenant.rentAmount?.toLocaleString("en-IN")}
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
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="cursor-pointer bg-blue-600 text-white"
                          onClick={() => handleOpenModal(tenant)}
                        >
                          <Mail size={14} className="mr-1" />
                          Message
                        </Button>
                      </div>
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
              </TableBody>
            </Table>
            <div className="flex gap-4">
              <div>Total: {counts.total}</div>
              <div className="text-green-600">Active: {counts.active}</div>
              <div className="text-yellow-600">Upcoming: {counts.upcoming}</div>
              <div className="text-red-600">Expired: {counts.expired}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    Message {selectedTenant?.name}
                  </h2>

                  <p className="text-blue-100 text-sm mt-1">
                    Send direct communication to tenant
                  </p>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer text-white/80 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Subject */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Subject
                </label>

                <input
                  autoFocus
                  type="text"
                  placeholder="Enter message subject"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Message
                </label>

                <textarea
                  rows={6}
                  placeholder="Write your message..."
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-5 border-t bg-gray-50">
              <button
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer border border-gray-300 bg-red text-black hover:bg-red-500 hover:text-black rounded-xl px-5"
              >
                Cancel
              </button>

              <button
                onClick={handleSend}
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-2"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
