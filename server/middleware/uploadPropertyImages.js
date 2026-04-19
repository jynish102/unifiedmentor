const multer = require("multer");

// storage (you already have)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.originalUrl.includes("profile")) {
      cb(null, "uploads/profile"); // profile images
    } else {
      cb(null, "uploads/properties"); //  property images
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

//  FILE FILTER (IMPORTANT)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); //  allow
  } else {
    cb(new Error("Only image files are allowed!"), false); //  reject
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
