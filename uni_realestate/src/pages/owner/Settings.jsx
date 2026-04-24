import { useEffect, useState } from "react";
import API from "../../utils/api";
import { Button } from "../../components/ui/button";
import { Pencil } from "lucide-react";

export default function ProfileCard() {
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState(null);
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
        const res = await API.get("/profile-data",
          
          { 
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        ); // your API endpoint
        console.log("API RESPONSE:", res.data);//
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };

    fetchProfile();
  }, []);

   useEffect(() => {
     if (user) {
       setFormData({
         fullname: user.fullname || "",
         email: user.email || "",
         phone: user.phone || "",
       });
     }
   }, [user]);

   const handleChange = (e) => {
     setFormData({
       ...formData,
       [e.target.name]: e.target.value,
     });
   };

   const handleEdit = () => {
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

       alert("Profile updated successfully ");
     } catch (err) {
       console.error(err);
       alert("Update failed ");
     }
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

  return (
    <div className="flex items-center justify-between p-8 bg-white rounded-2xl shadow-md max-w-5xl mx-auto">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div className="relative w-32 h-32">
          {/* Profile Image */}
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
            <h2 className="text-2xl font-semibold">{user.fullname}</h2>
          )}
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
        </div>
      </div>

      {/* Right Section */}
      {!isEditing ? (
        <Button onClick={handleEdit} className="bg-blue-600 text-white">
          Edit Profile
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button onClick={handleSave} className="bg-green-600 text-white">
            Save
          </Button>
          <Button onClick={handleCancel} className="bg-gray-800 text-white">
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
