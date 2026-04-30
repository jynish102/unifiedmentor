import { Outlet, Link, useLocation } from "react-router";
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
  Dumbbell
} from "lucide-react";
import { useState } from "react";

export  function OwnerDashboardLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { path: "/owner/ownerdashboard", name: "Dashboard", icon: LayoutDashboard },
    { path: "/owner/properties", name: "Properties", icon: Building2 },
    { path: "/owner/amenities", name: "Amenities", icon: Dumbbell },
    { path : "/owner/staff", name: "Staff ", icon: User },
    { path: "/owner/maintenance", name: "Maintenance", icon: Wrench },
    { path: "/owner/settings", name: "Settings", icon: Settings },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

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
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
