const UserModel = require("./../../schemas/user.schema");
const { hashPassword } = require("../../helpers/bcrypt");
const ROLES = require("../../constants/role.constant");
const errorHandler = require("../../helpers/errorHandler");
const EmailConfig = require("../../helpers/email");

const getAllEmployees = async (req, res) => {
  try {
    const logged_in_user = res.locals.user;
    const employees =
      logged_in_user.role === ROLES.HR
        ? await UserModel.find(
            { role: ROLES.EMPLOYEE },
            { password: 0, __v: 0 }
          )
        : await UserModel.find({}, { password: 0, __v: 0 });

    for (let i = 0; i < employees.length; i++) {
      const employee = employees[i];
      const user = await UserModel.findById(
        employee.created_by,
        "name email department"
      );
      employee.created_by = user;
    }

    return res.status(200).json({
      status: "success",
      message: "",
      data: employees,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching the employee",
    });
  }
};

const getEmployee = async (req, res) => {
  try {
    const employee = await UserModel.findById(req.params.id);

    if (!employee) {
      return res
        .status(404)
        .json({ status: "error", message: "Employee not found" });
    }

    const user = await UserModel.findById(
      employee.created_by,
      "name email department"
    );
    employee.created_by = user;

    return res.status(200).json({
      status: "success",
      message: "",
      data: employee,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching the employee",
    });
  }
};

const addEmployee = async (req, res) => {
  try {
    const request = new UserModel(req.body);
    const password = req.body.password;

    const logged_in_user = res.locals.user;
    request.created_by = logged_in_user.user_id;

    request.password = await hashPassword(password);

    const employee = await request.save();

    const mail = {
      to: employee.email,
      subject: "Welcome! Your Login Information",
      html: `<p>Hello ${employee.name}, <br> 
            Your login credentials for the portal are:</p>  
            <p>Username: <b>${employee.email}</b>, <br> 
            Password: <b>${password}</b>.</p> 
            <p>Please reset your password after logging in</p> `,
    };

    const sendEmail = await EmailConfig.sendEmail(mail);

    delete employee.password;

    !sendEmail
      ? res.status(500).json({
          status: "error",
          message: `Registered successfully, but email delivery failed. Please contact support.`,
        })
      : res.status(201).json({
          status: "success",
          message: `Employee added successfully`,
          data: employee,
        });
  } catch (err) {
    errorHandler(err, res);
  }
};

const updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await UserModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      return res
        .status(404)
        .json({ status: "error", message: "Employee not found" });
    }

    return res.status(200).json({
      status: "success",
      message: `Employee details updated successfully`,
      data: updatedEmployee,
    });
  } catch (err) {
    errorHandler(err, res);
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await UserModel.findByIdAndDelete(req.params.id);

    if (!deletedEmployee) {
      return res
        .status(404)
        .json({ status: "error", message: "Employee not found" });
    }

    return res
      .status(201)
      .json({ status: "success", message: "Employee deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while deleting the employee",
    });
  }
};

module.exports = {
  getAllEmployees,
  getEmployee,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};
