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
export default function StaffProfile() {
  const [staff, setStaff] = useState(null);
  const [preview, setPreview] = useState(null);
  const [counts, setCounts] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/profile-data", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log("API:", res.data);

        setStaff(res.data.user);
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
    if (!staff) return;

    setFormData({
      fullname: staff.fullname ?? "",
      email: staff.email ?? "",
      phone: staff.phone ?? "",
    });
  }, [staff]);

  if (!staff) {
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
      setStaff(res.data.user || { ...staff, ...formData });

      setIsEditing(false);
      alert("Profile updated successfully ");
    } catch (err) {
      console.error(err);
      alert(" updated Failed ");
    }
  };

  const handleEdit = () => {
    setFormData({
      fullname: staff.fullname || "",
      email: staff.email || "",
      phone: staff.phone || "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      fullname: staff.fullname || "",
      email: staff.email || "",
      phone: staff.phone || "",
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
      setStaff((prev) => ({
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
                      : staff?.profileImage
                        ? `http://localhost:5000/${staff.profileImage}`
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
                    {/* NAME */}
                    {isEditing ? (
                      <input
                        name="fullname"
                        value={formData.fullname || ""}
                        onChange={handleChange}
                        className="text-xl font-bold border px-2 py-1 rounded"
                      />
                    ) : (
                      <h2 className="text-2xl font-bold">{staff.fullname}</h2>
                    )}

                    <p className="text-gray-500 capitalize">{staff.role}</p>

                    {/* EMAIL */}
                    <div className="mt-2">
                      {isEditing ? (
                        <input
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="border px-2 py-1 rounded w-full"
                        />
                      ) : (
                        <p className="text-gray-700">📧 {staff.email}</p>
                      )}
                    </div>

                    {/* PHONE */}
                    <div>
                      {isEditing ? (
                        <input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="border px-2 py-1 rounded w-full"
                        />
                      ) : (
                        <p className="text-gray-700">📞 {staff.phone}</p>
                      )}
                    </div>
                    <div>
                      {!isEditing ? (
                        <button
                          onClick={handleEdit}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md"
                        >
                          Edit Profile
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-green-600 text-white rounded-md"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-800 text-white rounded-md"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full w-fit">
                    <CheckCircle className="w-4 h-4" />
                    {staff.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Rental */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <div className="flex items-center gap-2 mb-4"></div>
              <p>🛠 Specialization: {staff.specialization}</p>
              <p>
                📅 Joined: {new Date(staff.createdAt).toLocaleDateString()}
              </p>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
