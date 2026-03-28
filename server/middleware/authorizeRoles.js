// const adminMiddleware = (req, res, next) => {
//    if (!req.user) {
//      return res.status(401).json({ message: "Not authenticated" });
//    }

//   if (req.user.role !== "admin") {
//     return res.status(403).json({ message: "Access denied. Admin only." });
//   }
//   // console.log("Admin user:", req.user);
//   next();

// };

// module.exports = adminMiddleware ;

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

module.exports = authorizeRoles;