import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import logo from "../assets/logo2.png";

const ResetPassword = () => {
  const { token } = useParams(); // from URL
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [shake, setShake] = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const getStrength = (password) => {
    if (password.length < 6) return "Weak";
    if (
      password.match(/[A-Z]/) &&
      password.match(/[0-9]/) &&
      password.match(/[^A-Za-z0-9]/)
    )
      return "Strong";
    return "Medium";
  };

  const strength = getStrength(formData.password);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      triggerShake();
      return;
    }

    console.log("Token:", token);
    console.log("New Password:", formData.password);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=80)",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Glass Card */}
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8"
      >
        <div className="text-center mb-6">
          <img src={logo} alt="Logo" className="mx-auto w-24 mb-4" />
          <h2 className="text-2xl font-bold text-white">Create New Password</h2>
          <p className="text-sm text-white/70 mt-2">
            Your new password must be different from previously used passwords.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="New Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* Strength Meter */}
            {formData.password && (
              <div className="mt-2 text-sm">
                <span
                  className={`font-medium ${
                    strength === "Weak"
                      ? "text-red-400"
                      : strength === "Medium"
                        ? "text-yellow-400"
                        : "text-green-400"
                  }`}
                >
                  Strength: {strength}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className={`relative ${shake ? "animate-shake" : ""}`}>
            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
              className={`w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 border ${
                formData.confirmPassword &&
                formData.password !== formData.confirmPassword
                  ? "border-red-400"
                  : "border-white/30"
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition"
          >
            Reset Password
          </button>
        </form>

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
};

export default ResetPassword;
