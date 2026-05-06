import {motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect,useState } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import API from "../utils/api";
import toast from "react-hot-toast";

const ContactHeader = () => {
    {/*contact header section*/}
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const blobX = useTransform(mouseX, [0, window.innerWidth], [-50, 50]);
  const blobY = useTransform(mouseY, [0, window.innerHeight], [-50, 50]);

  {/*contact form section*/}
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    inquiryType: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await API.post("/support", formData);

    toast.success(res.data.message || "Message Sent Successfully!");

    // clear form after submit
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      inquiryType: "",
      message: "",
    });
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to send message");
  }
};

  return (
    <>
      {/* ================= Contact Header Section ================= */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-700 dark:from-gray-900 dark:via-gray-800 dark:to-black">
        {/* Parallax Blob */}
        <motion.div
          style={{ x: blobX, y: blobY }}
          className="absolute w-96 h-96 bg-pink-500 opacity-30 rounded-full blur-3xl"
        />

        {/* Glass Card with Animated Glow Border */}
        <div className="relative z-10 p-[2px] rounded-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-pulse">
          <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 rounded-3xl px-10 py-16 text-center max-w-3xl">
            {/* Typewriter Heading */}
            <motion.h1
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-yellow-300 to-blue-400 whitespace-nowrap overflow-hidden border-r-4 border-white pr-2 animate-pulse"
            >
              Let’s Build Something Amazing
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.8 }}
              className="mt-6 text-lg md:text-xl text-white/90"
            >
              Have questions, feedback, or ideas? We’re excited to hear from
              you.
            </motion.p>
          </div>
        </div>

        {/* Wave Bottom */}
        <div className="absolute bottom-0 w-full">
          <svg viewBox="0 0 1440 320" className="w-full h-28">
            <path
              fill="white"
              d="M0,192L60,197.3C120,203,240,213,360,224C480,235,600,245,720,229.3C840,213,960,171,1080,170.7C1200,171,1320,213,1380,234.7L1440,256L1440,320L0,320Z"
            />
          </svg>
        </div>
      </section>

      {/* ================= Contact Info Section ================= */}
      <section className="relative w-full py-20 bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-700 dark:from-gray-900 dark:via-gray-800 dark:to-black overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Contact Information
            </h2>
            <p className="mt-4 text-white/80">
              Reach out to us through any of the following ways.
            </p>
          </div>

          {/* Glass Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Email */}
            <div className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 text-center transition duration-300 hover:scale-105 hover:bg-white/20">
              <div className="flex justify-center mb-4">
                <Mail className="w-8 h-8 text-pink-400 group-hover:scale-110 transition" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
              <p className="text-white/80">support@pixelaura.com</p>
            </div>

            {/* Phone */}
            <div className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 text-center transition duration-300 hover:scale-105 hover:bg-white/20">
              <div className="flex justify-center mb-4">
                <Phone className="w-8 h-8 text-yellow-400 group-hover:scale-110 transition" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Phone</h3>
              <p className="text-white/80">+91 98765 43210</p>
            </div>

            {/* Location */}
            <div className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 text-center transition duration-300 hover:scale-105 hover:bg-white/20">
              <div className="flex justify-center mb-4">
                <MapPin className="w-8 h-8 text-blue-400 group-hover:scale-110 transition" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Location
              </h3>
              <p className="text-white/80">Ahmedabad, India</p>
            </div>

            {/* Working Hours */}
            <div className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 text-center transition duration-300 hover:scale-105 hover:bg-white/20">
              <div className="flex justify-center mb-4">
                <Clock className="w-8 h-8 text-green-400 group-hover:scale-110 transition" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Working Hours
              </h3>
              <p className="text-white/80">Mon – Fri : 9:00 AM – 6:00 PM</p>
            </div>
          </div>
        </div>
      </section>

      {/*===========contact form section===========*/}

      <section className="w-full py-20 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-6">
          {/* Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              Get In Touch
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Interested in a property? Send us a message and our team will
              contact you shortly.
            </p>
          </div>

          {/* Glass Form */}
          <div className="backdrop-blur-xl bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/20 shadow-xl rounded-3xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {/* Email */}
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {/* Phone */}
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {/* Inquiry Type Dropdown */}
              <select
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleChange}
                required
                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Inquiry Type</option>
                <option value="accept my property request">Accept My property Request </option>
                <option value="reactivate account">Reactivate Account</option>
                <option value="other">Other</option>
              </select>

              {/* Subject */}
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {/* Message */}
              <textarea
                name="message"
                rows="5"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition duration-300 shadow-lg hover:shadow-indigo-500/50"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
      {/*==================map=================================== */}
      <section className="relative w-full py-20">
        <div className="max-w-6xl mx-auto px-6 relative">
          {/* Map */}
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <iframe
              title="Ahmedabad Location"
              src="https://www.google.com/maps?q=Ahmedabad,India&output=embed"
              width="100%"
              height="500"
              style={{ border: 0 }}
              loading="lazy"
            ></iframe>
          </div>

          {/* Floating Card (Change theme styles here) */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-md">
            {/* THEME STYLING GOES HERE */}
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 text-white shadow-2xl rounded-3xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Our Headquarters</h3>
              <p className="text-white/90">
                301, Business Tower,
                <br />
                SG Highway,
                <br />
                Ahmedabad, Gujarat, India
              </p>
              <p className="mt-4 font-semibold text-indigo-300">
                +91 98765 43210
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactHeader;
