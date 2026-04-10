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

//owner
import { OwnerDashboard } from "./pages/owner/OwnerDashboard";
import { Properties as OwnerProperties } from "./pages/owner/Properties";
import { AddProperty as OwnerAddProperty } from "./pages/owner/AddProperty";
import { PropertyDetails as OwnerPropertyDetails } from "./pages/owner/PropertyDetails";
import { Amenities as OwnerAmenities } from "./pages/owner/Amenities";
import { Financials } from "./pages/owner/Financials";
import { Settings } from "./pages/owner/Settings";

//tenants
import { Dashboard as TenantsDashboard } from "./pages/tenants/Dashboard";
import { Profile } from "./pages/tenants/Profile";
import { TenantAmenities } from "./pages/tenants/TenantAmenities";
import { TenantMaintenance } from "./pages/tenants/TenantMaintenance";



function App() {
  return (
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
          <Route path="/admin/properties/edit/:id" element={<AddProperty />} />
          <Route path="/admin/properties/:id" element={<PropertyDetails />} />
          <Route path="amenities" element={<Amenities />} />
          <Route
            path="/admin/amenities/add-amenity/:propertyId"
            element={<AddAmenity />}
          />
          <Route path="/admin/amenities/edit/:id" element={<AddAmenity />} />
          <Route path="/admin/amenities/:id" element={<AmenityDetails />} />
          <Route path="tenants" element={<Tenants />} />
          <Route path="maintenance" element={<Maintenance />} />
        </Route>
        //owner routes
        <Route path="/owner" element={<OwnerDashboardLayout />}>
          <Route path="ownerdashboard" element={<OwnerDashboard />} />
          <Route path="properties" element={<OwnerProperties />} />
          <Route path="properties/add-property" element={<OwnerAddProperty />} />
          
          <Route path="/owner/properties/:id" element={<OwnerPropertyDetails />} /> 
          <Route path="amenities" element={<OwnerAmenities />} />
          <Route path="financials" element={<Financials />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        //tenant routes
        <Route path="/tenant" element={<TenantsDashboardLayout />}>
          <Route path="dashboard" element={<TenantsDashboard />} />
          <Route path="amenities" element={<TenantAmenities />} />
          <Route path="maintenance" element={<TenantMaintenance />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        //staff routes
        <Route path="/staff" element={<StaffDashboardLayout />}>
          {/* Define staff-specific routes here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
