import { useEffect, useState } from "react";
import API from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function StaffList() {
  const [staff, setStaff] = useState([]);
  const navigate = useNavigate();

  const fetchStaff = async () => {
    const token = localStorage.getItem("token");

    const res = await API.get("/staff", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setStaff(res.data.data);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">My Staff</h1>

        <button
          onClick={() => navigate("/owner/staff/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Staff
        </button>
      </div>

      {/* LIST */}
      <div className="grid gap-4">
        {staff.map((s) => (
          <div key={s._id} className="border p-4 rounded">
            <h2 className="font-semibold">{s.fullname}</h2>
            <p>{s.email}</p>
            <p>{s.phone}</p>
            <p className="text-sm text-gray-500">{s.specialization}</p>

            <p className="mt-2">Status: {s.isActive ? "Active" : "Disabled"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
