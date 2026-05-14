import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Calendar,
  Wrench,
  User,
  Menu,
  Bell,
  Dumbbell,
  MailIcon,
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { Badge } from "../components/ui/badge";

import { useEffect, useState, useRef } from "react";
import API from "../utils/api";

const navigation = [
  { path: "/tenant/dashboard", name: "Dashboard", icon: Home },
  { path: "/tenant/properties", name: "Properties", icon: Home },
  { path: "/tenant/amenities", name: "Amenities", icon: Dumbbell },
  { path: "/tenant/bookings", name: "Bookings", icon: Calendar },
  { path: "/tenant/message", name: "Message", icon: MailIcon },
  { path: "/tenant/maintenance", name: "Maintenance", icon: Wrench },
  { path: "/tenant/profile", name: "Profile", icon: User },
];




function NavLinks({ location }) {
  return (
    <>
      {navigation.map((item) => {
        const isActive =
          item.path === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(item.path);

        const Icon = item.icon;

        return (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Icon className="size-5" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </>
  );
}

// MAIN COMPONENT
export function TenantsDashboardLayout() {
  const location = useLocation();
  const [tenant, setTenant] = useState(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/profile-data", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTenant(res.data.user);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

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
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 z-40 hidden lg:flex flex-col w-64 h-screen bg-white border-r">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">TenantHub</h1>
          <p className="text-sm text-gray-600 mt-1">
            {tenant?.property || "Building"}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLinks location={location} />
        </nav>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64 flex-1">
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

            <div
              className="flex items-center gap-2"
              onClick={() => {
                navigate("/tenant/notification");
              }}
            >
              <Button className="cursor-pointer" variant="ghost" size="icon">
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
                        navigate("/tenant/profile");
                        setOpen(false);
                      }}
                      className="cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black"
                    >
                      Profile
                    </Button>

                    <Button
                      onClick={handleLogout}
                      className="cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100  hover:text-red-500"
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
