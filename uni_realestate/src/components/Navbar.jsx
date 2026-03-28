import logo2 from "../assets/logo2.png";
import { Link, NavLink } from "react-router-dom";
const Navbar = () => {
  return (
    <>
      {/* Navbar */}
      <nav className="flex justify-between items-center px-1 py-1 bg-sky-950 shadow-md">
        <img src={logo2} alt="Logo" className="h-30 w-40 object-contain mx-5" />

        <div className="space-x-6 hidden md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-2xl ${
                isActive
                  ? "text-green-300 font-semibold"
                  : "text-white hover:text-green-200"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/features"
            className={({ isActive }) =>
              `text-2xl ${
                isActive
                  ? "text-green-300 font-semibold"
                  : "text-white hover:text-green-200"
              }`
            }
          >
            Features
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `text-2xl ${
                isActive
                  ? "text-green-300 font-semibold"
                  : "text-white hover:text-green-200"
              }`
            }
          >
            Contact
          </NavLink>
        </div>

        <div className="space-x-4">
          <Link to="/login">
            <button className="px-4 py-2 text-white border border-green-200 rounded-lg hover:bg-blue-500">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              Register
            </button>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
