const express = require("express");
const {
  register,
  login,
  validateCode,
  forgotPassword,
  resetPassword,
} = require("./auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-code", validateCode);

module.exports = router;
