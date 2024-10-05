const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema(
  {
    name: String,
    value: String,
  },
  { timestamps: true }
);

const RolesModel = mongoose.model("tbl_roles", roleSchema);

module.exports = RolesModel;
