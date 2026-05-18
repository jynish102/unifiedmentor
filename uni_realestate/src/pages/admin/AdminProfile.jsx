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
  LogOut,
  Eye,
  EyeOff,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import API from "../../utils/api";
import toast from "react-hot-toast";

export default function AdminProfile() {
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState(null);
  const [, setCounts] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
  });

  //notification settings state
  // const [settings, setSettings] = useState({
  //   booking: true,
  //   maintenance: true,
  //   amenity: true,
  // });

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

  {
    /*-----------name validation--------------------- */
  }
  const validateName = (name) => {
    const regex = /^[A-Za-z\s]+$/;
    return regex.test(name);
  };

  const isValidName = validateName(formData.fullname);

  {
    /*======================email validation======================== */
  }
  const validateEmail = (email) => {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    return emailRegex.test(email);
  };
  const emailIsValid = validateEmail(formData.email);

  const domain = formData.email.split("@")[1];

  const validDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
  ];

  const isCorrectDomain = validDomains.includes(domain);

  {
    /*======================phone validation======================== */
  }
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };
  const phoneIsValid = validatePhone(formData.phone);

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

        setUser(res.data.user);
        setCounts(res.data.counts);

        setFormData({
          fullname: res.data.user.fullname ?? "",
          email: res.data.user.email ?? "",
          phone: res.data.user.phone ?? "",
        });
      } catch (error) {
        console.log("Error:", error.response?.data || error.message);
        toast.error(
          error.response?.data?.message || "Failed to update password",
        );
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (!user) {
    return <div className="min-h-screen bg-muted/30">Loading...</div>;
  }

  const handleChange = (e) => {
     const { name, value } = e.target;

     // Validation for fullname
     if (name === "fullname") {
       const regex = /^[A-Za-z\s]*$/;
       if (!regex.test(value)) return;
     }

     setFormData((prev) => ({
       ...prev,
       [name]: value,
     }));

     // Create updated form
     const updatedForm = {
       ...formData,
       [name]: value,
     };

     setFormData(updatedForm);

  };

  const handleSave = async () => {
    if (!isValidName) {
           toast.error(`Please Fix Name Error!!!`);
           return;
         }
    
         if (!emailIsValid || !isCorrectDomain) {
           toast.error(`Please Fix Email Error!!!`);
           return;
         }
    
         if (!phoneIsValid) {
           toast.error(`Please Fix PhoneNumber Error!!!`);
           return;
         }
    try {
      const token = localStorage.getItem("token");

      const res = await API.put("/update-profile-data", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // update UI with latest backend response
      setUser(res.data.user || { ...user, ...formData });

      setIsEditing(false);
      toast.success("Profile updated successfully ");
    } catch (err) {
      console.log("Error", err.response?.data?.message);
      toast.error(err.response?.data?.message || "updated Failed ");
    }
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

      toast.success("Password updated successfully");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Error", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to update password");
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
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 w-full relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            {/* Image */}
            <div className="relative w-32 h-32">
              <img
                src={
                  preview
                    ? preview
                    : user?.profileImage
                      ? `http://localhost:5000/${user.profileImage}`
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
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  {/* NAME */}
                  {isEditing ? (
                    <>
                      <input
                        autoFocus
                        type="text"
                        name="fullname"
                        value={formData.fullname || ""}
                        onChange={handleChange}
                        className={`text-xl font-bold border px-2 py-1 rounded ${
                          formData.fullname
                            ? isValidName
                              ? "border-green-400 focus:ring-green-400"
                              : "border-red-500 focus:ring-red-400"
                            : "border-white/30 focus:ring-purple-400"
                        }`}
                      />
                      {formData.fullname && (
                        <p
                          className={`mt-2 text-sm ${isValidName ? "text-green-400" : "text-red-400"}`}
                        >
                          {isValidName
                            ? "✓ Valid name"
                            : "✗ Only letters and spaces allowed"}
                        </p>
                      )}
                    </>
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

                  <p className="text-gray-500 capitalize">{user.role}</p>

                  {/* EMAIL */}
                  <div className="mt-2">
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`border px-2 py-1 rounded w-full ${
                            formData.email
                              ? emailIsValid
                                ? "border-green-400 focus:ring-green-400"
                                : "border-red-500 focus:ring-red-400"
                              : "border-white/30 focus:ring-purple-400"
                          }`}
                        />
                        {formData.email && (
                          <p
                            className={`mt-2 text-sm ${
                              emailIsValid && isCorrectDomain
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {emailIsValid && isCorrectDomain
                              ? "✓ Valid email address"
                              : !emailIsValid
                                ? "✗ Email must be lowercase and valid format"
                                : "✗ Please check email domain spelling"}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-700">📧 {user.email}</p>
                    )}
                  </div>

                  {/* PHONE */}
                  <div>
                    {isEditing ? (
                      <>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={(e) => {
                            const onlyNumbers = e.target.value.replace(
                              /\D/g,
                              "",
                            );
                            handleChange({
                              target: { name: "phone", value: onlyNumbers },
                            });
                          }}
                          className={`border px-2 py-1 rounded w-full ${
                            formData.phone
                              ? phoneIsValid
                                ? "border-green-400 focus:ring-green-400"
                                : "border-red-500 focus:ring-red-400"
                              : "border-white/30 focus:ring-purple-400"
                          }`}
                        />
                        {formData.phone && (
                          <p
                            className={`mt-2 text-sm ${
                              phoneIsValid ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {phoneIsValid
                              ? "✓ Valid phone number"
                              : "✗ Phone number must be exactly 10 digits"}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-700">📞 {user.phone}</p>
                    )}
                  </div>

                  <div>
                    {!isEditing ? (
                      <Button
                        onClick={handleEdit}
                        className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md"
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          type="submit"
                         
                          onClick={handleSave}
                          className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded-md"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={handleCancel}
                          className="cursor-pointer px-4 py-2 bg-gray-800 text-white rounded-md"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
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
              <span
                onClick={() => togglePassword("current")}
                className="absolute right-3 top-2.5 cursor-pointer"
              >
                {showPassword.current ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </span>
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
                <p
                  className={rules.length ? "text-green-600" : "text-gray-500"}
                >
                  ✔ At least 6 characters
                </p>
                <p
                  className={
                    rules.uppercase ? "text-green-600" : "text-gray-500"
                  }
                >
                  ✔ One uppercase letter
                </p>
                <p
                  className={
                    rules.lowercase ? "text-green-600" : "text-gray-500"
                  }
                >
                  ✔ One lowercase letter
                </p>
                <p
                  className={rules.number ? "text-green-600" : "text-gray-500"}
                >
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
                {showPassword.confirm ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </span>
            </div>
            <Button
              onClick={handleChangePassword}
              disabled={!isValidPassword}
              className={`cursor-pointer text-white ${
                isValidPassword
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed opacity-60"
              }`}
            >
              Update Password
            </Button>
          </div>
        </div>

        {/* Notification Settings
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
        </div> */}
      </div>
    </div>
  );
}
