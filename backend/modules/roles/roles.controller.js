const RolesModel = require("./roles.schema");
const ROLES = require("../../constants/role.constant");

const getAllRoles = async (req, res) => {
  try {
    const logged_in_user = res.locals.user;

    const excludeRoles =
      logged_in_user.role === ROLES.HR ? [ROLES.ADMIN, ROLES.HR] : [];

    const roles = await RolesModel.find(
      { value: { $nin: excludeRoles } },
      { updatedAt: 0, createdAt: 0, __v: 0 }
    );
    return res.status(200).json({
      status: "success",
      message: "",
      data: roles,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching the roles",
    });
  }
};

module.exports = getAllRoles;
