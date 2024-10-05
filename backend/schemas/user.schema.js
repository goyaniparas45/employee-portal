const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name cannot be empty"],
    },
    email: {
      type: String,
      required: [true, "Email cannot be empty"],
      match: [/.+\@.+\..+/, "Please enter a valid email"],
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password cannot be empty"],
    },
    role: {
      type: String,
      required: [true, "Role cannot be empty"],
    },
    department: {
      type: String,
      required: [true, "Department cannot be empty"],
    },
    onboardingStatus: {
      type: String,
      required: [true, "Onboarding status cannot be empty"],
      default: "pending",
    },
    login_method: {
      type: String,
      required: [true, "Login method cannot be empty"],
      enum: ["email", "google"],
    },
    created_by: String,
    resetPasswordToken: String,
    resetPasswordToken: Date,
  },
  { timestamps: true }
);

const UserModel = mongoose.model("tbl_user", userSchema);

module.exports = UserModel;
