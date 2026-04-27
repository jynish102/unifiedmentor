import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import { AdminDashboardLayout } from "./layouts/AdminDashboardLayout";
import { OwnerDashboardLayout } from "./layouts/OwnerDashboardLayout";
import {TenantsDashboardLayout} from "./layouts/TenantsDashboardLayout";
import { StaffDashboardLayout } from "./layouts/StaffDashboardLayout";

import Home from "./pages/Home";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

//admin
import { Overview } from "./pages/admin/Overview";
import { Properties } from "./pages/admin/Properties";
import { Tenants } from "./pages/admin/Tenants";
import { Amenities } from "./pages/admin/Amenities";
import Maintenance  from "./pages/admin/Maintenance";
import PropertyDetails from "./pages/admin/PropertyDetails";
import AddProperty from "./pages/admin/AddProperty";
import AddAmenity from "./pages/admin/AddAmenity";
import AmenityDetails from "./pages/admin/AmenityDetails";
import BookingRequests from "./pages/admin/BookingRequests";

//owner
import { OwnerDashboard } from "./pages/owner/OwnerDashboard";
import  OwnerProperties  from "./pages/owner/Properties";
import OwnerAddProperty  from "./pages/owner/AddProperty";
import  OwnerPropertyDetails  from "./pages/owner/PropertyDetails";
import OwnerAmenities  from "./pages/owner/Amenities";
import OwnerAddAmenity from "./pages/owner/AddAmenity";
import OwnerAmenityDetails from "./pages/owner/AmenityDetails";
import StaffList from "./pages/owner/StaffManagement";
import OwnerMaintenance from "./pages/owner/Maintenance";
import Settings from "./pages/owner/Settings";

//tenants
import { Dashboard as TenantsDashboard } from "./pages/tenants/Dashboard";
import Profile  from "./pages/tenants/Profile";
import TenantProperty from "./pages/tenants/Property";
import TenantPropertyDetails from "./pages/tenants/PropertyDetails";
import PropertyBooking from "./pages/tenants/PropertyBooking";
import TenantAmenities  from "./pages/tenants/TenantAmenities";
import TenantAmenityDetails from "./pages/tenants/AmenityDetails";
import AmenityBooking from "./pages/tenants/AmenityBooking";
import AllBooking from "./pages/tenants/AllBookings";
import  CreateMaintenance   from "./pages/tenants/CreateMaintenance";
import TenantMaintenance  from "./pages/tenants/TenantMaintenance";



function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            padding: "16px 20px",
            fontSize: "20px",
            fontWeight: "500",
            borderRadius: "10px",
            minWidth: "300px",
            minHeight: "100px",
          },
        }}
      />
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          <Route element={<AuthLayout />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
            <Route path="/ResetPassword/:token" element={<ResetPassword />} />
          </Route>
          //admin routes
          <Route path="/admin" element={<AdminDashboardLayout />}>
            <Route path="overview" element={<Overview />} />
            <Route path="properties" element={<Properties />} />
            <Route path="properties/add-property" element={<AddProperty />} />
            <Route
              path="/admin/properties/edit/:id"
              element={<AddProperty />}
            />
            <Route path="/admin/properties/:id" element={<PropertyDetails />} />
            <Route path="amenities" element={<Amenities />} />
            <Route
              path="/admin/amenities/add-amenity/:propertyId"
              element={<AddAmenity />}
            />
            <Route path="/admin/amenities/edit/:id" element={<AddAmenity />} />
            <Route path="/admin/amenities/:id" element={<AmenityDetails />} />
            <Route path="tenants" element={<Tenants />} />
            <Route path="bookings" element={<BookingRequests />} />
            <Route path="maintenance" element={<Maintenance />} />
          </Route>
          //owner routes
          <Route path="/owner" element={<OwnerDashboardLayout />}>
            <Route path="ownerdashboard" element={<OwnerDashboard />} />
            <Route path="properties" element={<OwnerProperties />} />
            <Route
              path="properties/add-property"
              element={<OwnerAddProperty />}
            />
            <Route
              path="/owner/properties/edit/:id"
              element={<OwnerAddProperty />}
            />
            <Route
              path="/owner/properties/:id"
              element={<OwnerPropertyDetails />}
            />
            <Route path="amenities" element={<OwnerAmenities />} />
            <Route
              path="/owner/amenities/add-amenity/:propertyId"
              element={<OwnerAddAmenity />}
            />
            <Route
              path="/owner/amenities/edit/:id"
              element={<OwnerAddAmenity />}
            />
            <Route
              path="/owner/amenities/:id"
              element={<OwnerAmenityDetails />}
            />
            <Route path="/owner/staff" element={<StaffList />} />
            <Route path="/owner/maintenance" element={<OwnerMaintenance />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          //tenant routes
          <Route path="/tenant" element={<TenantsDashboardLayout />}>
            <Route path="dashboard" element={<TenantsDashboard />} />
            <Route path="properties" element={<TenantProperty />} />
            <Route
              path="/tenant/properties/:id"
              element={<TenantPropertyDetails />}
            />
            <Route
              path="/tenant/properties/booking/:propertyId"
              element={<PropertyBooking />}
            />

            <Route path="amenities" element={<TenantAmenities />} />
            <Route
              path="/tenant/amenities/:id"
              element={<TenantAmenityDetails />}
            />
            <Route
              path="/tenant/amenities/booking/:amenityId"
              element={<AmenityBooking />}
            />
            <Route path="/tenant/bookings" element={<AllBooking />} />
            <Route
              path="/tenant/maintenance/create/:type/:id"
              element={<CreateMaintenance />}
            />
            <Route path="/tenant/maintenance" element={<TenantMaintenance />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          
          //staff routes
          <Route path="/staff" element={<StaffDashboardLayout />}>
            {/* Define staff-specific routes here */}
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
