const express = require("express");
const {
  register,
  login,
  validateCode,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("./auth.controller");
const getUserPermission = require("../permissions/permission.controller");
const auth = require("../../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", auth, changePassword);
router.get("/permission", auth, getUserPermission);
router.post("/verify-code", validateCode);

module.exports = router;
