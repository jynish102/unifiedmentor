import {
  Building2,
  Wrench,
  CalendarCheck,
  ShieldCheck,
  LayoutDashboard,
  Users,
  Activity,
  CheckCircle,
  Bell,
  Lock,
  Database,
  Cloud,
} from "lucide-react";

const features = [
  {
    icon: <Building2 size={28} />,
    title: "Property Rental Management",
    desc: "Manage rental listings with live availability tracking.",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: <Wrench size={28} />,
    title: "Maintenance Tracking",
    desc: "Raise and monitor maintenance requests in real-time.",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    icon: <CalendarCheck size={28} />,
    title: "Amenity Booking",
    desc: "Book gym, hall, and pool with instant confirmation.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Secure Payments",
    desc: "Encrypted and safe rent transactions system.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: <LayoutDashboard size={28} />,
    title: "Admin Dashboard",
    desc: "Centralized control panel with real-time insights.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: <Users size={28} />,
    title: "Role-Based Access",
    desc: "Separate access for Admin, Owner, Tenant & Staff.",
    gradient: "from-teal-500 to-green-500",
  },
];

const realtimeFeatures = [
  {
    icon: <Activity size={24} />,
    title: "Instant Status Updates",
    desc: "Track property availability and rent updates instantly.",
  },
  {
    icon: <CheckCircle size={24} />,
    title: "Booking Confirmation",
    desc: "Receive immediate confirmation for bookings.",
  },
  {
    icon: <Bell size={24} />,
    title: "Maintenance Notifications",
    desc: "Get notified when maintenance tasks are updated.",
  },
];

const securityFeatures = [
  {
    icon: <Lock size={28} />,
    title: "Secure Authentication",
    desc: "Role-based login system with protected user sessions and encrypted credentials.",
    gradient: "from-indigo-600 to-blue-600",
  },
  {
    icon: <Database size={28} />,
    title: "Data Protection",
    desc: "User data stored securely with validation, encryption and safe database handling.",
    gradient: "from-green-600 to-emerald-500",
  },
  {
    icon: <Cloud size={28} />,
    title: "Cloud Deployment",
    desc: "Deployed on reliable cloud infrastructure for high availability and performance.",
    gradient: "from-cyan-600 to-sky-500",
  },
];

const CoreFeatures = () => {
  return (
    <section className="py-24 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        {/* ================= Core Features ================= */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800">
            Core System Features
          </h2>
          <p className="text-gray-600 mt-4">
            Powerful tools designed to simplify complete property management.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 mb-24">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-8 rounded-3xl text-white shadow-xl 
                         bg-gradient-to-br ${feature.gradient}
                         hover:scale-105 transition duration-300`}
            >
              <div className="bg-white/20 w-14 h-14 flex items-center justify-center rounded-full mb-6">
                {feature.icon}
              </div>

              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-sm opacity-90">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* ================= Real-Time Capabilities ================= */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800">
            Real-Time Capabilities
          </h2>
          <p className="text-gray-600 mt-4">
            Stay updated with instant system notifications and live tracking.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {realtimeFeatures.map((item, index) => (
            <div
              key={index}
              className="relative bg-white p-8 rounded-3xl shadow-xl 
                         hover:shadow-2xl transition duration-300"
            >
              {/* Live Indicator */}
              <span className="absolute top-6 right-6 w-3 h-3 bg-green-500 rounded-full animate-ping"></span>
              <span className="absolute top-6 right-6 w-3 h-3 bg-green-500 rounded-full"></span>

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-full flex items-center 
                              justify-center text-white bg-gradient-to-br 
                              from-blue-500 to-green-500 mb-6"
              >
                {item.icon}
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {item.title}
              </h3>

              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* =========================Section Title========================== */}
        <div className="text-center mb-16 top-10 mt-8">
          <h2 className="text-4xl font-bold text-gray-800">
            Security & Reliability
          </h2>
          <p className="text-gray-600 mt-4">
            Built with enterprise-level security and dependable infrastructure.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-10">
          {securityFeatures.map((item, index) => (
            <div
              key={index}
              className={`p-10 rounded-3xl text-white shadow-2xl 
                         bg-gradient-to-br ${item.gradient}
                         hover:scale-105 hover:shadow-3xl
                         transition duration-300`}
            >
              {/* Icon */}
              <div className="bg-white/20 w-16 h-16 flex items-center justify-center rounded-full mb-6">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold mb-4">{item.title}</h3>

              {/* Description */}
              <p className="text-sm opacity-90 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreFeatures;
