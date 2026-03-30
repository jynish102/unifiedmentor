import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import {TenantsDashboardLayout} from "./layouts/TenantsDashboardLayout";
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

//tenants
import { Dashboard } from "./pages/tenants/Dashboard";
import { Profile } from "./pages/tenants/Profile";
import { Amenities as TenantAmenities } from "./pages/tenants/TenantAmenities";
import { Maintenance as TenantMaintenance } from "./pages/tenants/TenantMaintenance";

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
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="/admin"  element={<DashboardLayout />}>
          <Route path="overview" element={<Overview />} />
          <Route path="properties" element={<Properties />} />
          <Route path="tenants" element={<Tenants />} />
          <Route path="amenities" element={<Amenities />} />
          <Route path="maintenance" element={<Maintenance />} />
        </Route>

        <Route path="/tenant" element={<TenantsDashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="amenities" element={<TenantAmenities />} />
          <Route path="maintenance" element={<TenantMaintenance />} />
          <Route path="profile" element={<Profile />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
