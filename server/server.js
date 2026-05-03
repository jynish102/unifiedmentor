require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authorizeRoles = require("./middleware/authorizeRoles");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const propertyRoutes = require("./routes/propertyRoutes");
const amenityRoutes = require("./routes/amenityRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const amenityBookingRoutes = require("./routes/amenityBookingRoutes");
const ownerDashboardRoutes = require("./routes/ownerDashboardRoutes");
const tenantDashboardRoutes = require("./routes/tenantDashboardRoutes");
const tenantRoutes = require("./routes/tenantRoutes");
const profileRoutes = require("./routes/profileRoutes");
const userRoutes = require("./routes/userRoutes");
const supportRoutes = require("./routes/supportRoutes");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

// dashboard check
app.use("/api/admin", authMiddleware, adminRoutes);

app.use("/api/property", propertyRoutes);

app.use("/uploads", express.static("uploads"));

app.use("/api/amenity", amenityRoutes);

app.use("/api/property-bookings", bookingRoutes);

app.use("/api/amenity-bookings", amenityBookingRoutes);

app.use("/api/staff", userRoutes);

app.use("/api/maintenance", maintenanceRoutes);

app.use("/api/owner", ownerDashboardRoutes);

app.use("/api/tenant", tenantDashboardRoutes);

app.use("/api/tenants", tenantRoutes);

app.use("/api" , profileRoutes);

app.use("/api" , supportRoutes);

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected "))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} `);
});
