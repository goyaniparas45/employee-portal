const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  role: String,
  module: String,
  read: Boolean,
  write: Boolean,
  update: Boolean,
  delete: Boolean,
});

const PermissionModel = mongoose.model("tbl_permissions", permissionSchema);

module.exports = PermissionModel;
