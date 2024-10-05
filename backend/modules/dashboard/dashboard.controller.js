const Task = require("./../tasks/tasks.schema");

const dashboardData = async (req, res) => {
  try {
    const logged_in_user = res.locals.user;
    const tasks = await Task.find({
      assignee: logged_in_user.user_id,
    });
    const data = {
      task_completed: tasks.filter((task) => task.status === "completed")
        .length,
      task_pending: tasks.filter((task) => task.status === "pending").length,
    };
    return res.status(200).json({
      status: "success",
      message: "",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching the employee",
    });
  }
};

module.exports = dashboardData;
