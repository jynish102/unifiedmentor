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
import { Button } from "../../components/ui/button";
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

  //notification settings state
  const [settings, setSettings] = useState({
    booking: true,
    maintenance: true,
    amenity: true,
  });

  //change password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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

  //handle password change
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await API.put(
        "/change-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Password updated successfully");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to update password");
    }
  };

  //handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  //handle Notifications toggle
  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  //handle account deactivation
  const handleDeactivate = async () => {
    const confirmAction = window.confirm(
      "Are you sure you want to deactivate your account?",
    );

    if (!confirmAction) return;

    try {
      const token = localStorage.getItem("token");

      await API.put(
        "/deactivate-account",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      alert("Failed to deactivate account");
    }
  };

  return (
    <div className="space-y-6">
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

      {/* Change Password Section */}
      <div className="bg-white p-6 rounded-2xl shadow-md max-w-5xl mx-auto mt-6">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

        <div className="space-y-3">
          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            className="w-full border p-2 rounded"
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            className="w-full border p-2 rounded"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            className="w-full border p-2 rounded"
          />

          <Button
            onClick={handleChangePassword}
            className="bg-blue-600 text-white"
          >
            Update Password
          </Button>
        </div>
      </div>
      {/* Logout Button */}
      <div className="bg-white p-6 rounded-2xl shadow-md max-w-5xl mx-auto mt-6">
        <h2 className="text-xl font-semibold text-red-600 mb-4">
          Account Actions
        </h2>

        <Button onClick={handleLogout} className="bg-red-600 text-white">
          Logout
        </Button>
      </div>

      {/* Notification Settings */}
      <div className="bg-white p-6 rounded-2xl shadow-md max-w-5xl mx-auto mt-6">
        <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>

        <div className="space-y-3">
          {Object.keys(settings).map((key) => (
            <div key={key} className="flex justify-between items-center">
              <span className="capitalize">{key} Alerts</span>
              <button
                onClick={() => handleToggle(key)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                  settings[key] ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                    settings[key] ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Deactivate Account */}
      <div className="bg-white p-6 rounded-2xl shadow-md max-w-5xl mx-auto mt-6 border border-yellow-300">
        <h2 className="text-xl font-semibold text-yellow-600 mb-2">
          Deactivate Account
        </h2>

        <p className="text-gray-600 mb-4">
          Your account will be temporarily disabled. You can contact admin to
          reactivate it.
        </p>

        <Button onClick={handleDeactivate} className="bg-yellow-500 text-white">
          Deactivate Account
        </Button>
      </div>

      {/* Delete Account */}
      <div className="bg-white p-6 rounded-2xl shadow-md max-w-5xl mx-auto mt-6 border border-red-300">
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Delete Account
        </h2>

        <p className="text-gray-600 mb-4">
          This action is permanent and cannot be undone.
        </p>

        <Button className="bg-red-600 text-white">Delete Account</Button>
      </div>
    </div>
  );
}
