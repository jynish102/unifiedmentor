import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  Dumbbell,
  Wrench,
  Calendar,
  Menu,
  Bell,
  Search,
  FileText,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useState, useEffect, useRef } from "react";
import API from "../utils/api";

const navItems = [
  {
    path: "/admin/admin-dashboard",
    label: "Admin Dashboard",
    icon: LayoutDashboard,
  },
  {
    path: "/admin/properties-requests",
    label: "Properties Requests",
    icon: Calendar,
  },
  { path: "/admin/properties", label: "Properties", icon: Building2 },
  { path: "/admin/amenities", label: "Amenities", icon: Dumbbell },

  { path: "/admin/tenants", label: "Tenants", icon: Users },
  { path: "/admin/maintenance", label: "Maintenance", icon: Wrench },
  { path: "/admin/support-requests", label: "Requests", icon: FileText },
];

export function AdminDashboardLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState(null);

  //handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const dropdownRef = useRef();

  //profile Picture 
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile-data", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);



  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
      const fetchUnreadCount = async () => {
        try {
          const res = await API.get("/notifications/unread-count", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          setUnreadCount(res.data.count);
        } catch (error) {
          console.log(error);
        }
      };

    fetchUnreadCount();

    const handleStorage = () => {
      fetchUnreadCount();
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-900">Rental Manager</h1>
          <p className="text-sm text-slate-500">Admin Dashboard</p>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }
                `}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  navigate("/admin/notification");
                }}
              >
                <Bell size={20} />

                {unreadCount > 0 && (
                  <span className="absolute top-5 right-15 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-medium">
                    {unreadCount}
                  </span>
                )}
              </Button>

              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={() => setOpen(!open)}
                  className="w-10 h-10 rounded-full overflow-hidden cursor-pointer border-2 border-blue-500"
                >
                  {user?.profileImage ? (
                    <img
                      src={`http://localhost:5000/${user.profileImage}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                      {user?.fullname?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>

                {open && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-50">
                    <Button
                      onClick={() => {
                        navigate("/admin/profile");
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
