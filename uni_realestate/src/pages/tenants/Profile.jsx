import {
  User,
  Home,
  CreditCard,
  Calendar,
  FileText,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Pencil,
} from "lucide-react";
import { useEffect, useState } from "react";
import API from "../../utils/api";
export default function TenantProfile() {
  const [tenant, setTenant] = useState(null);
  const [preview, setPreview] = useState(null);
  const [counts, setCounts] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email:  "",
    phone: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/profile-data",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // console.log("API:", res.data);

        setTenant(res.data.user); 
        setCounts(res.data.counts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    if (tenant) {
      setFormData({
        email: tenant.email || "",
        phone: tenant.phone || "",
      });
    }
  }, [tenant]);

  if (!tenant) {
    return <div className="min-h-screen bg-muted/30">Loading...</div>;
  }

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const handleSave = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.put("/update-profile-data", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // update UI with latest backend response
    setTenant(res.data.user || { ...tenant, ...formData });

    setIsEditing(false);
    alert("Profile updated successfully ");
  } catch (err) {
    console.error(err);
    alert(" updated Failed ");
  }
};

const handleEdit = () => {
  setFormData({
    email: tenant.email || "",
    phone: tenant.phone || "",
  });
  setIsEditing(true);
};

const handleCancel = () => {
  setFormData({
    email: tenant.email || "",
    phone: tenant.phone || "",
  });
  setIsEditing(false);
};
  const handleImageUpload = async (file) => {
  if (!file) return;
  const token = localStorage.getItem("token");

  // 1. Show preview instantly
  const previewUrl = URL.createObjectURL(file);
  setPreview(previewUrl);

  try {
    // 2. Upload to backend
    const formData = new FormData();
    formData.append("image", file);

    const res = await API.put("/auth/profile-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    

    // 3. Update real image from server
    setTenant((prev) => ({
      ...prev,
      profileImage: res.data.profileImage,
    }));

    // 4. Clear preview (optional)
    setPreview(null);

  } catch (err) {
    console.error(err);
  }
};
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-primary/10 to-primary/5"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16">
              <div className="relative w-32 h-32">
                {/* Profile Image */}
                <img
                  src={
                    preview
                      ? preview
                      : tenant?.profileImage
                        ? `http://localhost:5000/${tenant.profileImage}`
                        : "/default-avatar.jpg"
                  }
                  className="w-32 h-32 rounded-full object-cover border-4 border-card shadow-md"
                />

                {/* Edit Icon */}
                <label className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow cursor-pointer hover:bg-gray-100">
                  <Pencil className="w-4 h-4 text-gray-700" />

                  {/* Hidden Input */}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                  />
                </label>
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h1 className="text-foreground">{tenant.fullname}</h1>
                    <p className="text-muted-foreground">
                      Tenant since {tenant.joinDate}
                    </p>
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  <h2 className="text-foreground">Personal Information</h2>
                </div>

                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="text-sm px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="text-sm px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-sm px-3 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-900"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* EMAIL */}
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="w-full">
                    <p className="text-muted-foreground">Email</p>

                    {isEditing ? (
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border rounded px-2 py-1"
                      />
                    ) : (
                      <p className="text-foreground">{tenant.email}</p>
                    )}
                  </div>
                </div>

                {/* PHONE */}
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="w-full">
                    <p className="text-muted-foreground">Phone</p>

                    {isEditing ? (
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border rounded px-2 py-1"
                      />
                    ) : (
                      <p className="text-foreground">{tenant.phone}</p>
                    )}
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
                    <p className="text-foreground">{tenant.property}</p>
                    <p className="text-muted-foreground">{tenant.address}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-muted-foreground">Move-in Date</p>
                    <p className="text-foreground">
                      {tenant.leaseStart
                        ? new Date(tenant.leaseStart).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Lease End</p>
                    <p className="text-foreground">
                      {tenant.leaseEnd
                        ? new Date(tenant.leaseEnd).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly Rent</p>
                    <p className="text-foreground">
                      ₹{tenant.rentAmount?.toLocaleString()}/{tenant.paymentFrequency}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Security Deposit</p>
                    <p className="text-foreground">₹{tenant.deposit?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
