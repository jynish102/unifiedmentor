import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Building2,
  Waves,
  DollarSign,
  Settings,
  Menu,
  X,
  User,
  Wrench,
  Dumbbell,
  Inbox,
  Calendar,
  Bell
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";


export function OwnerDashboardLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { path: "/owner/ownerdashboard", name: "Dashboard", icon: LayoutDashboard },
    { path: "/owner/properties", name: "Properties", icon: Building2 },
    { path: "/owner/amenities", name: "Amenities", icon: Dumbbell },
    { path: "/owner/bookings-request", name: "Bookings", icon: Calendar },
    { path: "/owner/staff", name: "Staff ", icon: User },
    { path: "/owner/maintenance", name: "Maintenance", icon: Wrench },
    { path: "/owner/tenants", name: "Tenants", icon: User },
    { path: "/owner/settings", name: "Settings", icon: Settings },
    { path: "/owner/messages", name: "Messages", icon: Inbox },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  //handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

   const dropdownRef = useRef();
  
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          setOpen(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Owner Portal</h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 bg-white border-r border-gray-200`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="mb-8 px-3 pt-2">
            <h1 className="text-2xl font-bold text-gray-900">Owner Portal</h1>
            <p className="text-sm text-gray-600 mt-1">Rental Management</p>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="size-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-4 gap-4">
            <div className="flex items-center gap-4 flex-1">
              <button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon"
              onClick={() => {
                navigate(`/owner/notification`)
                }}>
                <Bell size={20} />
              </Button>
              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={() => setOpen(!open)}
                  className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white"
                >
                  JD
                </div>

                {open && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-50">
                    <Button
                      onClick={() => {
                        navigate("/owner/settings");
                        setOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black"
                    >
                      Profile
                    </Button>

                    <Button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100  hover:text-red-500"
                    >
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
