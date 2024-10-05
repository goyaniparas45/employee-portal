const PermissionModel = require("./permission.schema");

const getUserPermission = async (req, res) => {
  try {
    const logged_in_user = res.locals.user;

    const permissions = await PermissionModel.find(
      {
        role: logged_in_user.role,
      },
      "read write update delete module"
    );

    if (!permissions) {
      return res.status(403).json({ status: "error", message: "Unauthorized" });
    }

    const response = {};

    for (let i = 0; i < permissions.length; i++) {
      const permission = permissions[i];
      response[permission.module] = {
        read: permission.read,
        write: permission.write,
        update: permission.update,
        delete: permission.delete,
      };
    }

    return res
      .status(200)
      .json({ status: "success", message: "Authorized", data: response });
  } catch (error) {
    return res.status(403).json({ status: "error", message: "Unauthorized" });
  }
};

module.exports = getUserPermission;
