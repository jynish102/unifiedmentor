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
  LogOut
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import API from "../../utils/api";
export default function StaffProfile() {
  const [staff, setStaff] = useState(null);
  const [preview, setPreview] = useState(null);
  const [counts, setCounts] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tasks, setTasks] = useState([]);
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

 useEffect(() => {
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/maintenance/my-assignments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(res.data.data); // make sure this matches your API response
    } catch (err) {
      console.error(err);
    }
  };

  fetchTasks();
}, []);



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

  const currentTask = tasks.find((task) => 
    task.status === "in-progress");

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

const statusConfig = getStatusConfig(staff.isActive);
  

  return (
    <div className="min-h-screen bg-muted/30 py-8 ">
      <div className="max-w-5xl mx-auto space-y-6 px-4 ">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 w-full relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            {/* Image */}
            <div className="relative w-32 h-32">
              <img
                src={
                  preview
                    ? preview
                    : staff?.profileImage
                      ? `http://localhost:5000/${staff.profileImage}`
                      : "/default-avatar.jpg"
                }
                className="w-32 h-32 rounded-full object-cover border-4 shadow-md"
              />

              <label className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow cursor-pointer">
                <Pencil className="w-4 h-4 text-gray-700" />
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                />
              </label>
            </div>

            {/* Info */}
            <div className="flex-1 flex justify-between items-start ">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  {staff.fullname}

                  <span
                    className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${statusConfig.color}`}
                  >
                    {statusConfig.icon}
                    {statusConfig.label}
                  </span>
                </h2>

                <div className="absolute top-4 right-4">
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full hover:bg-red-100 transition"
                    title="Logout"
                  >
                    <LogOut className="w-6 h-6 text-red-600" />
                  </button>
                </div>
                <p className="text-gray-500">{staff.role}</p>

                <p className="text-gray-700 mt-2">📧 {staff.email}</p>
                <p className="text-gray-700">📞 {staff.phone}</p>

                <button
                  onClick={handleEdit}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Specialization Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 w-full">
          <p>🛠 Specialization: {staff.specialization}</p>
          <p className="mt-1">
            📅 Joined: {new Date(staff.createdAt).toLocaleDateString()}
          </p>
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

        {/* task section */}
        {currentTask && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 shadow-sm">
            <p className="font-semibold text-yellow-800">Current Task</p>
            <p className="text-lg font-medium">{currentTask.title}</p>
            <p className="text-sm text-gray-500">
              📍 {currentTask.property?.title || "N/A"}
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">My Assignments</h2>

          {tasks.length === 0 ? (
            <p className="text-gray-500">No tasks assigned</p>
          ) : (
            <div className="space-y-4">
              {tasks.slice(0, 5).map((task) => (
                <div
                  key={task._id}
                  className="flex justify-between items-center border rounded-xl p-4 hover:shadow-sm transition"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{task.title || task.issue}</p>

                    <p className="text-sm text-gray-500">
                      📍 {task.property?.title || "N/A"}
                    </p>

                    <p className="text-xs text-gray-400">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : task.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Deactivate Account */}
        <div className="bg-white p-6 rounded-2xl shadow-md w-full border border-yellow-300 space-y-4">
          <h2 className="text-xl font-semibold text-yellow-600 mb-2">
            Deactivate Account
          </h2>

          <p className="text-gray-600 mb-4">
            Your account will be temporarily disabled. You can contact admin to
            reactivate it.
          </p>

          <Button
            onClick={handleDeactivate}
            className="bg-yellow-500 text-white"
          >
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
    </div>
  );
}
