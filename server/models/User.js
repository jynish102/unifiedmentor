const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["tenant", "owner", "staff", "admin"],
      default: "tenant",
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

   
    isActive: {
      type: Boolean,
      default: true,
    },

    
    specialization: {
      type: String,
    },
  },
  { timestamps: true },
);

    userSchema.pre("save", async function () {
      if (!this.isModified("password")) return;

      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    });

module.exports = mongoose.model("User", userSchema);
