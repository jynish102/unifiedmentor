import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/logo2.png";
import axios from "axios";


const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  {/*======================password ======================== */}
  const [shake, setShake] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  

  const handleChange = (e) => {
    const {name , value} = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log(res.data);

      // store token (if your API returns it)
      localStorage.setItem("token", res.data.token);

       //user Data
      localStorage.setItem("user", JSON.stringify(res.data.user));
        

    console.log("LOGIN USER:", res.data.user);
      // success
      setError("");

      //  🔥 redirect to dashboard
      // navigate("/dashboard");
      const role = res.data.user.role;

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "owner") {
        navigate("/owner");
      } else if (role === "tenant") {
        navigate("/tenant");
      } else {
        navigate("/staff"); // default fallback
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      triggerShake();
    }
  };


  const triggerShake = () => {
    setShake(true);
    setTimeout(() => {
      setShake(false);
    }, 400);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 "></div>

      <div className="relative z-10 w-full max-w-6xl flex items-center justify-between px-6">
        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col items-start text-white space-y-6">
          <img src={logo} alt="Logo" className="w-28" />

          <span className="bg-purple-600/80 px-4 py-1 rounded-full text-sm backdrop-blur-md">
            Real Estate Management Portal
          </span>

          <h1 className="text-4xl font-bold leading-tight">
            Welcome to Your <br /> Property Dashboard
          </h1>

          <p className="text-white/80 max-w-sm">
            Manage listings, connect with buyers, and grow your real estate
            business efficiently.
          </p>
        </div>

        {/* RIGHT SIDE FORM */}
        <motion.div
          initial={{ y: -120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full md:w-[450px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 text-white"
        >
          <h2 className="text-3xl font-bold mb-2 text-center">Login</h2>

          <p className="text-center text-white/70 mb-6">
            Access your real estate control panel
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm text-white/80">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full mt-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-white/60"
              />
            </div>

            {/* Password */}
            <div className={`relative ${shake ? "animate-shake" : ""}`}>
              <label className="text-sm text-white/80">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full mt-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-white/60"
              />
              {error && <p className="text-red-400 text-sm mt-1">{error}</p>}

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[42px] text-white/70 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-right text-sm">
              <Link
                to="/ForgotPassword"
                className="text-white/70 hover:text-purple-300 cursor-pointer"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 transition font-semibold"
            >
              Login
            </button>

            {/* Register Link */}
            <div className="text-center text-sm text-white/80 mt-4">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-purple-300 font-semibold hover:text-purple-400 transition"
              >
                Register
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
