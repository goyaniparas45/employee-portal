const mongoose = require("mongoose");

const verificationCode = new mongoose.Schema(
  {
    email: String,
    type: String,
    code: String,
    user_id: String,
    is_used: Boolean,
  },
  { timestamps: true }
);

const CodeVerificationModel = mongoose.model(
  "tbl_codes",
  verificationCode
);

module.exports = CodeVerificationModel;
