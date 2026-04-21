import { useEffect, useState } from "react";
import API from "../../utils/api";
import { Button } from "../../components/ui/button";

export default function ProfileCard() {
  const [user, setUser] = useState(null);

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
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };

    fetchProfile();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="flex items-center justify-between p-6 bg-white rounded-2xl shadow">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Profile Image */}
        <img
          src={user.profileImage || "/default-avatar.png"}
          alt="profile"
          className="w-16 h-16 rounded-full object-cover"
        />

        {/* User Info */}
        <div>
          <h2 className="text-lg font-semibold">{user.fullname}</h2>
          <p className="text-sm text-gray-500">{user.role}</p>

          <div className="text-sm text-gray-600 mt-1">
            <p>📧 {user.email}</p>
            <p>📞 {user.phone}</p>
            <p>📍 {user.location}</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <Button variant="outline">Edit Profile</Button>
    </div>
  );
}
