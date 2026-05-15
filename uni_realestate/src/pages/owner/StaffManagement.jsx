import { useEffect, useState } from "react";
import API from "../../utils/api";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/button";

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

  //Other Validation functions
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

  {
    /*-----------name validation--------------------- */
  }
  const validateName = (name) => {
    const regex = /^[A-Za-z\s]+$/;
    return regex.test(name);
  };
  const isValidName = validateName(form.fullname);

  {
    /*======================email validation======================== */
  }
  const validateEmail = (email) => {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    return emailRegex.test(email);
  };
  const emailIsValid = validateEmail(form.email);

  const domain = form.email.split("@")[1];

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
  const phoneIsValid = validatePhone(form.phone);

  //handle change for all inputs with validation for name, email, and phone
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation for fullname
    if (name === "fullname") {
      const regex = /^[A-Za-z\s]*$/;
      if (!regex.test(value)) return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Create updated form
    const updatedForm = {
      ...form,
      [name]: value,
    };

    setForm(updatedForm);
  };

  //handle submit
  const handleSubmit = async (e) => {
     e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.post("/staff/add", form,{
        
        fullname: form.fullname,
        email: form.email,
        phone: form.phone,
        role: form.role,
        password: form.password,
      
      }, {
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

        <Button
          onClick={() => {
            setOpen(true);
            generatePassword(); // auto password on open
          }}
          className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Staff
        </Button>
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

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Add Staff Member</h2>
                  <p className="text-blue-100 text-sm mt-1">
                    Create and manage staff access
                  </p>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="text-white/80 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Body */}
            <form  onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Full Name
                  </label>

                  <input
                    autoFocus
                    required
                    name="fullname"
                    placeholder="Enter full name"
                    value={form.fullname}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl bg-white/20 text-black border focus:outline-none focus:ring-2 ${
                      form.fullname
                        ? isValidName
                          ? "border-green-400 focus:ring-green-400"
                          : "border-red-500 focus:ring-red-400"
                        : " border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }`}
                  />
                  {form.fullname && (
                    <p
                      className={`mt-2 text-sm ${isValidName ? "text-green-400" : "text-red-400"}`}
                    >
                      {isValidName
                        ? "✓ Valid name"
                        : "✗ Only letters and spaces allowed"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Email Address
                  </label>

                  <input
                    required
                    name="email"
                    placeholder="Enter email"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl bg-white/20 text-black border focus:outline-none focus:ring-2 transition ${
                      form.email
                        ? emailIsValid && isCorrectDomain
                          ? "border-green-400 focus:ring-green-400"
                          : "border-red-500 focus:ring-red-400"
                        : "border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }`}
                  />

                  {form.email && (
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
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Phone Number
                  </label>

                  <input
                    required
                    name="phone"
                    placeholder="Enter phone number"
                    value={form.phone}
                    onChange={(e) => {
                      const onlyNumbers = e.target.value.replace(/\D/g, "");
                      handleChange({
                        target: { name: "phone", value: onlyNumbers },
                      });
                    }}
                    maxLength={10}
                    className={`w-full px-4 py-3 rounded-xl bg-white/20 text-black placeholder-white/70 border focus:outline-none focus:ring-2 transition ${
                      form.phone
                        ? phoneIsValid
                          ? "border-green-400 focus:ring-green-400"
                          : "border-red-500 focus:ring-red-400"
                        : "border border-gray-200 rounded-xl p-3 focus:outline-none  focus:ring-blue-500"
                    }`}
                  />

                  {form.phone && (
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
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Staff Role
                  </label>

                  <input
                    required
                    name="specialization"
                    placeholder="Cleaner, Guard..."
                    value={form.specialization}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Generated Password
                </label>

                <div className="flex gap-3">
                  <input
                      required
                    name="password"
                    placeholder="Password"
                    readOnly
                    value={form.password}
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3"
                  />

                  <Button
                    onClick={generatePassword}
                    className="cursor-pointer bg-gray-900 hover:bg-black text-white rounded-xl px-5"
                  >
                    Generate
                  </Button>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-5 border-t bg-gray-50">
              <Button
                onClick={() => setOpen(false)}
                className="border cursor-pointer border-gray-300 bg-red text-black hover:bg-red-500 hover:text-black rounded-xl px-5"
              >
                Cancel
              </Button>

              <Button
              type="submit"
                disabled={
                  !isValidName ||
                  !emailIsValid ||
                  !phoneIsValid ||
                  !isCorrectDomain
                }
                
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6"
              >
                Save Staff
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
