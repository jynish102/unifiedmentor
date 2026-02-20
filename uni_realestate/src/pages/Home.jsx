import logo from '../assets/logo.png'
import partyplot from "../assets/party-plot.jpg";
import Maintenance from '../assets/Maintenance.webp'
import office from '../assets/officeplace.webp'
import Amenities from "../assets/Amenities.jpg";
import {
  MapPin,
  IndianRupee,
  ShieldCheck,
  BadgeCheck,
  Wrench,
  Clock,
  UserPlus,
  Search,
  CalendarCheck,
  LayoutDashboard,
  Dumbbell,
  Car,
  Waves,
  Building2,
} from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-1 py-1 bg-blue-600 shadow-md">
        <img src={logo} alt="Logo" className="h-30 w-40 object-contain mx-5" />

        <div className="space-x-6 hidden md:flex">
          <a href="#" className="text-white hover:text-green-200 text-2xl">
            Home
          </a>
          <a href="#" className="text-white hover:text-green-200 text-2xl">
            Features
          </a>
          <a href="#" className="text-white hover:text-green-200 text-2xl">
            Contact
          </a>
        </div>

        <div className="space-x-4">
          <button className="px-4 py-2 text-white border border-green-200 rounded-lg hover:bg-blue-500">
            Login
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-20">
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-4xl font-bold text-gray-800">
            Smart Property Management Made Simple
          </h2>

          <p className="text-gray-600">
            Manage rentals, maintenance requests, and amenity bookings in
            real-time with a powerful and easy-to-use system.
          </p>

          <div className="space-x-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Explore Properties
            </button>
            <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
              Get Started
            </button>
          </div>
        </div>

        <div className="md:w-1/2 mt-10 md:mt-0">
          <img
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
            alt="Property"
            className="rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* Happy Community Section */}
      <section className="px-8 py-16 bg-white">
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Image Card */}
          <div className="md:w-1/2 relative group overflow-hidden rounded-xl shadow-lg">
            <img
              src={partyplot}
              alt="Celebration"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition duration-500">
              <div>
                <h3 className="text-white text-2xl font-bold">
                  Celebrating Happy Living
                </h3>
                <p className="text-gray-200 text-sm mt-2">
                  Trusted by tenants for seamless rental and booking
                  experiences.
                </p>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="md:w-1/2 space-y-4">
            <h3 className="text-3xl font-bold text-blue-600">
              A Community That Feels Like Home
            </h3>
            <p className="text-gray-600">
              Experience stress-free renting with real-time maintenance updates
              and smart amenity scheduling.
            </p>
          </div>
        </div>
      </section>

      {/* Property Management Section */}
      <section className="px-8 py-16 bg-gray-50">
        <div className="flex flex-col md:flex-row-reverse items-center gap-10">
          {/* Image Card */}
          <div className="md:w-1/2 relative group overflow-hidden rounded-xl shadow-lg">
            <img
              src={Maintenance}
              alt="Property Management"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition duration-500">
              <div>
                <h3 className="text-white text-2xl font-bold">
                  Professional Management
                </h3>
                <p className="text-gray-200 text-sm mt-2">
                  Efficient property handling with real-time task tracking.
                </p>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="md:w-1/2 space-y-4">
            <h3 className="text-3xl font-bold text-green-600">
              Smart Maintenance & Property Control
            </h3>
            <p className="text-gray-600">
              Owners and maintenance teams can efficiently manage properties,
              assign tasks, and update progress instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="px-8 py-16 bg-gray-50">
        <h3 className="text-3xl font-bold text-center text-blue-600 mb-12">
          Featured Properties
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Property Card 1 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition duration-300">
            {/* Image Section */}
            <div className="relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1568605114967-8130f3a36994"
                alt="Property"
                className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay Text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition duration-500">
                <div>
                  <h5 className=" text-white font-semibold text-lg">
                    Spacious 3BHK Villa
                  </h5>
                  <p className="text-gray-200 text-sm">
                    Private garden • Parking • Security
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h4 className="text-lg font-semibold text-green-600">
                Modern Apartment
              </h4>

              {/* Location */}
              <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                <MapPin size={16} className="text-blue-600" />
                <span>Mumbai, Maharashtra</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 text-blue-600 font-bold mt-2">
                <IndianRupee size={16} className="text-green-600" />
                <span>15,000 / month</span>
              </div>
            </div>
          </div>

          {/* Property Card 2 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition duration-300">
            {/* Image Section */}
            <div className="relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1570129477492-45c003edd2be"
                alt="Property"
                className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay Text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition duration-500">
                <div>
                  <h5 className="text-white font-semibold text-lg">
                    Spacious 3BHK Villa
                  </h5>
                  <p className="text-gray-200 text-sm">
                    Private garden • Parking • Security
                  </p>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
              <h4 className="text-lg font-semibold text-green-600">
                Luxury Villa
              </h4>

              {/* Location */}
              <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                <MapPin size={16} className="text-blue-600" />
                <span>Mumbai, Maharashtra</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 text-blue-600 font-bold mt-2">
                <IndianRupee size={16} className="text-green-600" />
                <span>35,000 / month</span>
              </div>
            </div>
          </div>

          {/* Property Card 3 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition duration-300">
            {/* Image Section */}
            <div className="relative overflow-hidden">
              <img
                src={office}
                alt="Property"
                className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay Text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition duration-500">
                <div>
                  <h5 className="text-white font-semibold text-lg">
                    Spacious 3BHK Villa
                  </h5>
                  <p className="text-gray-200 text-sm">
                    Private garden • Parking • Security
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h4 className="text-lg font-semibold text-green-600">
                Office Space
              </h4>

              {/* Location */}
              <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                <MapPin size={16} className="text-blue-600" />
                <span>Hyderabad, Telangana</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 text-blue-600 font-bold mt-2">
                <IndianRupee size={16} className="text-green-600" />
                <span>25,000 / month</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 py-16 bg-white">
        <h3 className="text-3xl font-bold text-center text-blue-600 mb-12">
          Our Features
        </h3>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            "Property Rental",
            "Maintenance Tracking",
            "Amenity Booking",
            "Admin Dashboard",
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-md hover:shadow-xl transition"
            >
              <h4 className="text-lg font-semibold text-green-600 mb-2">
                {feature}
              </h4>
              <p className="text-gray-600 text-sm">
                Efficient and real-time management with a user-friendly
                interface.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto relative">
          {/* LEFT MAIN CARD */}
          <div
            className="bg-gradient-to-br from-blue-600 to-green-500 
                    text-white p-26 rounded-r-4xl rounded-l-xl w-[60%] relative"
          >
            <h2 className="text-4xl font-bold mb-6">
              WHY <br /> CHOOSE US
            </h2>

            <p className="text-sm opacity-90 max-w-xs">
              Smart property management platform designed for tenants, owners,
              and administrators with real-time control.
            </p>

            {/* Decorative Circle Effect */}
            <div
              className="absolute right-0 top-0 w-60 h-60 
                      bg-white/10 rounded-full"
            ></div>
          </div>

          {/* FEATURES FLOATING ON RIGHT */}
          <div className="absolute top-2 left-168 right-5 space-y-12 w-[45%]">
            {/* Feature 1 */}
            <div className="flex items-start gap-5">
              <div className="bg-blue-100 p-4 rounded-full shadow-lg left-20">
                <ShieldCheck className="text-blue-600" size={22} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Secure Payments</h4>
                <p className="text-gray-500 text-sm">
                  Safe and encrypted rent & service transactions.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-5">
              <div className="bg-green-100 p-4 rounded-full shadow-lg">
                <BadgeCheck className="text-green-600" size={22} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">
                  Verified Properties
                </h4>
                <p className="text-gray-500 text-sm">
                  Every listing is verified for trust and safety.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-5">
              <div className="bg-blue-100 p-4 rounded-full shadow-lg">
                <Wrench className="text-blue-600" size={22} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">
                  24/7 Maintenance
                </h4>
                <p className="text-gray-500 text-sm">
                  Real-time maintenance tracking system.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start gap-5">
              <div className="bg-green-100 p-4 rounded-full shadow-lg">
                <Clock className="text-green-600" size={22} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">
                  Real-Time Booking
                </h4>
                <p className="text-gray-500 text-sm">
                  Instant amenity booking & rental management.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Map Style */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          {/* Title */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800">How It Works</h2>
            <p className="text-gray-500 mt-3">
              A simple journey from registration to full property management.
            </p>
          </div>

          {/* Roadmap */}
          <div className="relative">
            {/* Horizontal Line */}
            <div className="absolute top-10 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-green-500"></div>

            <div className="grid md:grid-cols-4 gap-10 relative">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg relative z-10">
                  <UserPlus size={28} />
                </div>
                <h4 className="mt-6 font-semibold text-gray-800">
                  Register Account
                </h4>
                <p className="text-gray-500 text-sm mt-2">
                  Create your account as tenant, owner, or admin.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg relative z-10">
                  <Search size={28} />
                </div>
                <h4 className="mt-6 font-semibold text-gray-800">
                  Browse Properties
                </h4>
                <p className="text-gray-500 text-sm mt-2">
                  Explore verified properties and amenities.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg relative z-10">
                  <CalendarCheck size={28} />
                </div>
                <h4 className="mt-6 font-semibold text-gray-800">
                  Book or Raise Request
                </h4>
                <p className="text-gray-500 text-sm mt-2">
                  Book property or submit maintenance request.
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg relative z-10">
                  <LayoutDashboard size={28} />
                </div>
                <h4 className="mt-6 font-semibold text-gray-800">
                  Manage Everything
                </h4>
                <p className="text-gray-500 text-sm mt-2">
                  Track bookings, payments, and requests in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Highlight Section */}
      <section className="py-24 bg-gray-100">
        <div className="max-w-6xl mx-auto relative">
          {/* Section Title */}
          <div className="text-center mb-16 ">
            <h2 className="text-4xl font-bold text-gray-800">
              Property Amenities
            </h2>
            <p className="text-gray-600 mt-3">
              Experience modern facilities with comfort and convenience.
            </p>
          </div>

          {/* Center Image */}
          <div className="flex justify-center ">
            <img src={Amenities} alt="Property" className="w-150 shadow-2xl rounded-b-4xl" />
          </div>

          {/* Top Left */}
          <div className="absolute -top-10 left-0 w-64 text-center">
            <div className="bg-green-500 text-white p-5 rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-lg">
              <Dumbbell size={28} />
            </div>
            <h4 className="mt-4 font-semibold text-gray-800">Gym Facility</h4>
            <p className="text-sm text-gray-600 mt-2">
              Fully equipped gym for residents.
            </p>
          </div>

          {/* Top Right */}
          <div className="absolute -top-10 right-0 w-64 text-center">
            <div className="bg-blue-500 text-white p-5 rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-lg">
              <Car size={28} />
            </div>
            <h4 className="mt-4 font-semibold text-gray-800">Parking Space</h4>
            <p className="text-sm text-gray-600 mt-2">
              Secure covered parking available.
            </p>
          </div>

          {/* Bottom Left */}
          <div className="absolute bottom-20 left-0 w-64 text-center">
            <div className="bg-green-500 text-white p-5 rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-lg">
              <Waves size={28} />
            </div>
            <h4 className="mt-4 font-semibold text-gray-800">Swimming Pool</h4>
            <p className="text-sm text-gray-600 mt-2">
              Modern pool with safety features.
            </p>
          </div>

          {/* Bottom Right */}
          <div className="absolute bottom-20 right-0 w-64 text-center">
            <div className="bg-blue-500 text-white p-5 rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-lg">
              <Building2 size={28} />
            </div>
            <h4 className="mt-4 font-semibold text-gray-800">Community Hall</h4>
            <p className="text-sm text-gray-600 mt-2">
              Perfect for events & gatherings.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white text-center py-6">
        © 2026 PropertyPro. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
