const ownerOrAdmin = (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "owner") {
    return next();
  }
  else{

  return res.status(403).json({
    message: "Access denied",
  });
 }
};

module.exports = ownerOrAdmin;
