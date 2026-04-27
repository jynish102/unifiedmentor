import { useEffect, useState } from "react";
import API from "../../utils/api";
import toast from "react-hot-toast";

export default function StaffList() {
  const [staff, setStaff] = useState([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    specialization: "",
    password: "",
  });

  const fetchStaff = async () => {
    const token = localStorage.getItem("token");

    const res = await API.get("/staff/my-staff", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setStaff(res.data.data);
  };

 useEffect(() => {
   const loadData = async () => {
     try {
       await fetchStaff();
     } catch (err) {
       console.error(err);
     }
   };

   loadData();
 }, []);

  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  
  const generatePassword = () => {
    const pass = Math.random().toString(36).slice(-8);
    setForm({ ...form, password: pass });
  };

 
  const validate = () => {
    if (!form.fullname || !form.email || !form.phone) {
      return "All fields required";
    }
    if (!form.email.includes("@")) {
      return "Invalid email";
    }

      if (form.password.length < 6) {
        return "Password must be at least 6 characters";
      }
    return null;
  };


  const handleSubmit = async () => {
    const error = validate();
    if (error) return toast.error(error);

    try {
      const token = localStorage.getItem("token");

      await API.post("/staff/add", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Staff added");

      setOpen(false);
      fetchStaff(); 

      setForm({
        fullname: "",
        email: "",
        phone: "",
        specialization: "",
        password: "",
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add staff");
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">My Staff</h1>

        <button
          onClick={() => {
            setOpen(true);
           generatePassword(); // auto password on open
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
           Add Staff
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

      {/* 🔥 MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-[400px] space-y-4">
            <h2 className="text-lg font-semibold">Add Staff</h2>

            <input
              name="fullname"
              placeholder="Full Name"
              value={form.fullname}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              name="specialization"
              placeholder="Role (Cleaner, Guard...)"
              value={form.specialization}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <div className="flex gap-2">
              <input
                name="password"
                placeholder="Password"
                readOnly
                value={form.password}
                className="w-full border p-2 rounded bg-gray-100"
              />
              <button
                onClick={generatePassword}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Generate Password
              </button>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
