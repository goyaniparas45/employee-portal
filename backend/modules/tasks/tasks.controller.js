const Task = require("./tasks.schema");
const errorHandler = require("../../helpers/errorHandler");
const UserModel = require("../../schemas/user.schema");
const ROLES = require("../../constants/role.constant");
const getAllTasks = async (req, res) => {
  try {
    const logged_in_user = res.locals.user;
    const tasks =
      logged_in_user.role === ROLES.HR
        ? await Task.find()
        : await Task.find({
            assignee: logged_in_user.user_id,
          });
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const user = await UserModel.findById(task.created_by);
      task.created_by = user;
    }

    return res.status(200).json({
      status: "success",
      message: "",
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching the tasks",
    });
  }
};

const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      assignee: logged_in_user.user_id,
    });

    if (!task) {
      return res
        .status(404)
        .json({ status: "error", message: "Task not found" });
    }

    const assignee = await UserModel.findById(task.assignee);
    task.assignee = assignee;

    const created_by = await UserModel.findById(task.created_by);
    task.created_by = created_by;

    return res.status(200).json({
      status: "success",
      message: "",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching the task details",
    });
  }
};

const addTask = async (req, res) => {
  try {
    const request = new Task(req.body);

    const logged_in_user = res.locals.user;
    request.created_by = logged_in_user.user_id;

    const employee = await request.save();

    return res.status(201).json({
      status: "success",
      message: `Task added successfully`,
      data: employee,
    });
  } catch (err) {
    errorHandler(err, res);
  }
};

const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return res
        .status(404)
        .json({ status: "error", message: "Task not found" });
    }

    return res.status(200).json({
      status: "success",
      message: `Task details updated successfully`,
      data: updatedTask,
    });
  } catch (err) {
    errorHandler(err, res);
  }
};

const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res
        .status(404)
        .json({ status: "error", message: "Task not found" });
    }

    return res
      .status(201)
      .json({ status: "success", message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while deleting the task",
    });
  }
};

module.exports = {
  getAllTasks,
  getTask,
  addTask,
  updateTask,
  deleteTask,
};
