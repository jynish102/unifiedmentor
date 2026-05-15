import { motion } from "framer-motion";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import logo from "../assets/logo2.png";
import API from "../utils/api";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({
    password: false,
    confirm: false,
  });

  const validatePassword = (password) => {
    return {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const rules = validatePassword(form.password);

  const isValid =
    rules.length &&
    rules.uppercase &&
    rules.lowercase &&
    rules.number &&
    rules.special &&
    form.password === form.confirmPassword;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isValid) return;

  try {
    const res = await API.put(`/auth/reset-password/${token}`, {
      password: form.password,
    });

    toast.success(res.data.message || "Password updated successfully");

    navigate("/login");
  } catch (err) {
    console.log(err);

    toast.error(err.response?.data?.message || "Failed to reset password");
  }
};
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=80)",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Card */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <img src={logo} alt="Logo" className="mx-auto w-24 mb-4" />

          <h2 className="text-2xl font-bold text-white">Create New Password</h2>

          <p className="text-sm text-white/70 mt-2">
            Your new password must be different from previously used passwords.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-white/70" size={18} />

            <input
              type={show.password ? "text" : "password"}
              name="password"
              placeholder="New Password"
              value={form.password}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              type="button"
              onClick={() => setShow({ ...show, password: !show.password })}
              className="absolute right-3 top-3 text-white/70"
            >
              {show.password ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-white/70" size={18} />

            <input
              type={show.confirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              type="button"
              onClick={() => setShow({ ...show, confirm: !show.confirm })}
              className="absolute right-3 top-3 text-white/70"
            >
              {show.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Rules */}
          <div className="text-sm space-y-1 mt-2">
            <p className={rules.length ? "text-green-400" : "text-white/60"}>
              ✔ At least 6 characters
            </p>

            <p className={rules.uppercase ? "text-green-400" : "text-white/60"}>
              ✔ One uppercase letter
            </p>

            <p className={rules.lowercase ? "text-green-400" : "text-white/60"}>
              ✔ One lowercase letter
            </p>

            <p className={rules.number ? "text-green-400" : "text-white/60"}>
              ✔ One number
            </p>

            <p className={rules.special ? "text-green-400" : "text-white/60"}>
              ✔ One special character
            </p>

            <p
              className={
                form.password === form.confirmPassword
                  ? "text-green-400"
                  : "text-white/60"
              }
            >
              ✔ Passwords match
            </p>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-3 rounded-xl text-white font-semibold transition ${
              isValid
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90"
                : "bg-gray-500 cursor-not-allowed"
            }`}
          >
            Update Password
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-white/70 mt-6">
          Back to{" "}
          <Link
            to="/login"
            className="text-purple-400 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
