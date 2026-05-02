import { useEffect, useState } from "react";
import API from "../../utils/api";
import { Button } from "../../components/ui/button";
import { Pencil, CheckCircle, Eye, EyeOff, LogOutIcon } from "lucide-react";
import tost from "react-hot-toast";

export default function ProfileCard() {
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
  });

  //change password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validatePassword = (password) => {
    const rules = {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    return rules;
  };

  const rules = validatePassword(passwordData.newPassword);

  const isValidPassword =
    rules.length &&
    rules.uppercase &&
    rules.lowercase &&
    rules.number &&
    rules.special &&
    passwordData.newPassword === passwordData.confirmPassword;

  //notification settings state
  const [settings, setSettings] = useState({
    booking: true,
    maintenance: true,
    amenity: true,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(
          "/profile-data",

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ); // your API endpoint
        console.log("API RESPONSE:", res.data); //
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = () => {
    setFormData({
      fullname: user.fullname || "",
      email: user.email || "",
      phone: user.phone || "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      fullname: user.fullname || "",
      email: user.email || "",
      phone: user.phone || "",
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.put("/update-profile-data", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data.user || { ...user, ...formData });
      setIsEditing(false);

      tost.success("Profile updated successfully ");
    } catch (err) {
      console.error(err);
      tost.error(err.response?.data?.message || "Upload failed");
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
      tost.error("Passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await API.put(
        "/auth/change-password",
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

      tost.success("Password updated successfully");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      tost.error(err.response?.data?.message || "Upload failed");
    }
  };

  //handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (!user) return <p>Loading...</p>;

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
      setUser((prev) => ({
        ...prev,
        profileImage: res.data.profileImage,
      }));

      // 4. Clear preview (optional)
      setPreview(null);
    } catch (err) {
      console.error(err);
    }
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
      tost.error("Failed to deactivate account");
    }
  };

  const getStatusConfig = (isActive) => {
    if (isActive) {
      return {
        color: "bg-green-100 text-green-700",
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Active",
      };
    } else {
      return {
        color: "bg-gray-100 text-gray-700",
        icon: <AlertCircle className="w-4 h-4" />,
        label: "Inactive",
      };
    }
  };

  const statusConfig = getStatusConfig(user.isActive);

  return (
    <div className="min-h-screen bg-muted/30 py-8 ">
      <div className="max-w-5xl mx-auto space-y-6 px-4 ">
        <div className="bg-white rounded-2xl shadow-md p-6 w-full relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            {/* Profile Image */}

            <div className="relative w-32 h-32">
              
              <img
                src={
                  preview
                    ? preview
                    : user?.profileImage
                      ? `http://localhost:5000/${user.profileImage}`
                      : "/default-user.webp"
                }
                alt="profile"
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
            
            {/* User Info */}
            <div>
              {isEditing ? (
                <input
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="text-2xl font-semibold border px-2 py-1 rounded"
                />
              ) : (
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  {user.fullname}
                  <span
                    className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${statusConfig.color}`}
                  >
                    {statusConfig.icon}
                    {statusConfig.label}
                  </span>
                </h2>
              )}
              <div className="absolute top-4 right-4">
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-red-100 transition"
                  title="Logout"
                >
                  <LogOutIcon className="w-6 h-6 text-red-600" />
                </button>
              </div>
              <p className="text-lg text-gray-500">{user.role}</p>

              <div className="text-lg text-gray-600 mt-2 space-y-1">
                {isEditing ? (
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded"
                  />
                ) : (
                  <p>📧 {user.email}</p>
                )}

                {isEditing ? (
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded"
                  />
                ) : (
                  <p>📞 {user.phone}</p>
                )}
              </div>
              {/* Right Section */}
              {!isEditing ? (
                <Button onClick={handleEdit} className="bg-blue-600 text-white">
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    className="bg-green-600 text-white"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={handleCancel}
                    className="bg-gray-800 text-white"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-white p-6 rounded-2xl shadow-md max-w-5xl mx-auto mt-6">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

        <div className="space-y-3">
          <div className="relative">
            <input
              type={showPassword.current ? "text" : "password"}
              name="currentPassword"
              placeholder="Current Password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword.new ? "text" : "password"}
              name="newPassword"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full border p-2 rounded"
            />
            <span
              onClick={() => togglePassword("new")}
              className="absolute right-3 top-2.5 cursor-pointer"
            >
              {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
            <div className="text-sm space-y-1 mt-2">
              <p className={rules.length ? "text-green-600" : "text-gray-500"}>
                ✔ At least 6 characters
              </p>
              <p
                className={rules.uppercase ? "text-green-600" : "text-gray-500"}
              >
                ✔ One uppercase letter
              </p>
              <p
                className={rules.lowercase ? "text-green-600" : "text-gray-500"}
              >
                ✔ One lowercase letter
              </p>
              <p className={rules.number ? "text-green-600" : "text-gray-500"}>
                ✔ One number
              </p>
            </div>
          </div>

          <div className="relative">
            <input
              type={showPassword.confirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full border p-2 rounded"
            />
            <span
              onClick={() => togglePassword("confirm")}
              className="absolute right-3 top-2.5 cursor-pointer"
            >
              {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          <Button
            onClick={handleChangePassword}
            disabled={!isValidPassword}
            className={`text-white ${
              isValidPassword
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed opacity-60"
            }`}
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
