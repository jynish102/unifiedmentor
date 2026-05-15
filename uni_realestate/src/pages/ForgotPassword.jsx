import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo2.png";
import { useState } from "react";
import API from "../utils/api";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await API.post("/auth/forgot-password", {
        email,
      });

      toast.success("Reset link generated");

      // for testing without real email
      //  window.location.href = res.data.resetUrl;

      // OR:
      navigate(`/resetpassword/${res.data.resetUrl.split("/").pop()}`);
    } catch (err) {
      console.log(err.response?.data || err.message);

      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
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
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Glass Form */}
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <img src={logo} alt="Logo" className="mx-auto w-24 mb-4" />
          <h2 className="text-2xl font-bold text-white">Reset Your Password</h2>
          <p className="text-sm text-white/70 mt-2">
            Forgot your password? No worries. Enter your registered email
            address and we’ll send you a secure reset link.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-white/60 mt-2">
              We will send a password reset link to this email.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition
            ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back to Login */}
        <p className="text-sm text-center text-white/70 mt-6">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-purple-400 hover:underline font-medium"
          >
            Back to Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
