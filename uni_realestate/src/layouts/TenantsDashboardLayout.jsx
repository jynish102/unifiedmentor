import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  Wrench,
  User,
  Menu,
  Bell,
  Dumbbell,
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { Badge } from "../components/ui/badge";

import { useEffect, useState } from "react";
import API from "../utils/api";

const navigation = [
  { path: "/tenant/dashboard", name: "Dashboard", icon: Home },
  { path: "/tenant/properties", name: "Properties", icon: Home },
  { path: "/tenant/amenities", name: "Amenities", icon: Dumbbell },
  { path: "/tenant/bookings", name: "Bookings", icon: Calendar },
  { path: "/tenant/maintenance", name: "Maintenance", icon: Wrench },
  { path: "/tenant/profile", name: "Profile", icon: User },
];

// ✅ MOVE THIS OUTSIDE
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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">TenantHub</h1>
          <p className="text-sm text-gray-600 mt-1">
            {tenant?.property || "Building"}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLinks location={location} />
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="size-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {tenant?.fullname ?
                  tenant.fullname
                .split(" ")
                .map((n) => n[0])
                .join(""):"U"}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{tenant?.fullname || "user"}</p>
              <p className="text-xs text-gray-600 truncate">
                {tenant?.unit || "no unit"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-64 p-0">
              <div className="p-6 border-b">
                <h1 className="text-2xl font-bold text-blue-600">TenantHub</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {tenant?.property || "building"}
                </p>
              </div>

              <nav className="p-4 space-y-2">
                <NavLinks location={location} />
              </nav>
            </SheetContent>
          </Sheet>

          <h1 className="text-xl font-bold text-blue-600">TenantHub</h1>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-5" />
            <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center bg-red-500 text-white text-xs">
              3
            </Badge>
          </Button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
