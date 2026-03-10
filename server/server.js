require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const adminMiddleware  = require("./middleware/adminMiddleware");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const propertyRoutes = require("./routes/propertyRoutes");
const amenityRoutes = require("./routes/amenityRoutes");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/admin", authMiddleware, adminRoutes);


app.use("/api/property", propertyRoutes);
app.use("/uploads", express.static("uploads"));

app.use("/api/amenity", amenityRoutes);

// Connect MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected ✅"))
    .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/admin-dashboard", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: "Welcome Admin 👑" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});


