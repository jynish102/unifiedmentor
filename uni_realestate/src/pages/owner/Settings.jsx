import { useEffect, useState } from "react";
import API from "../../utils/api";
import { Button } from "../../components/ui/button";
import { Pencil } from "lucide-react";

export default function ProfileCard() {
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState(null);

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
        console.log("API RESPONSE:", res.data);
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };

    fetchProfile();
  }, []);

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
                  : "/default-avatar.jpg"
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
          <h2 className="text-2xl md:text-3xl  font-semibold">
            {user.fullname}
          </h2>
          <p className="text-lg text-gray-500">{user.role}</p>

          <div className="text-lg text-gray-600 mt-2 space-y-1">
            <p>📧 {user.email}</p>
            <p>📞 {user.phone}</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <Button variant="outline">Edit Profile</Button>
    </div>
  );
}
