import logo2 from "../assets/logo2.png";
const Navbar = () => {
  return (
    <>
      {/* Navbar */}
      <nav className="flex justify-between items-center px-1 py-1 bg-sky-950 shadow-md">
        <img src={logo2} alt="Logo" className="h-30 w-40 object-contain mx-5" />

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
    </>
  );
};

export default Navbar;
