import { MdDeleteOutline } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { useEffect, useState } from "react";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
} from "../utils/toastUtils";
import { ToastContainer } from "react-toastify";
import { MdCheck } from "react-icons/md";
import {
  addTasks,
  updateTasks,
  fetchTasks,
  deleteTasks,
} from "../services/taskService";
import { fetchEmployees } from "../services/employeeService";
import { getUserData } from "../services/authService";

const Task = () => {
  const user = getUserData();

  const status = ["completed", "pending", "in-progress"];
  const [assignee, setAssignee] = useState([]);
  const [taskId, setTaskId] = useState("");
  const [loading, setLoading] = useState(false);
  const [Tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "",
    assignee: "",
    created_by: user.user_id,
  });

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const fetchAllTasks = async () => {
    try {
      const assigneeData = await fetchEmployees();
      const data = await fetchTasks();
      setTasks(data);
      setAssignee(assigneeData);
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      if (taskId) {
        updateTask(taskId, formData);
      } else {
        await addTasks(formData);
        showSuccessToast("Task added successfully!");
      }
      fetchAllTasks();
      resetForm();
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, data) => {
    try {
      await updateTasks(id, data);
      setTaskId(null);
      showSuccessToast("Task updated successfully!");
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const handleEdit = (task) => {
    setFormData(task);
    setTaskId(task._id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTasks(id);
      fetchAllTasks();
      showWarningToast("Task deleted successfully!");
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      assignee: "",
      status: "",
    });
    setTaskId(null);
  };

  const handleAssigneeChange = async (taskId, assignee, task) => {
    await updateTask(taskId, { ...task, assignee });
    await fetchAllTasks();
    resetForm();
  };

  const updateStatusChange = async (taskId, status, task) => {
    await updateTask(taskId, { ...task, status });
    await fetchAllTasks();
    resetForm();
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4 text-left">Task </h2>
      <div className="bg-white shadow-md rounded-lg p-6 mb-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="w-full">
              <label
                htmlFor="name"
                className="block text-gray-700 font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500 w-full"
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="assignee"
                className="block text-gray-700 font-semibold mb-2">
                Assignee
              </label>
              <select
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                required
                className="border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500 w-full">
                <option value="" disabled>
                  Select Assignee
                </option>
                {assignee.map((user) => (
                  <option key={user.name} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="w-full">
            <label
              htmlFor="assignee"
              className="block text-gray-700 font-semibold mb-2">
              Descripition
            </label>
            <textarea
              type="text"
              name="description"
              rows={6}
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              required
              className="border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500 w-full"
            />
          </div>
          <div className="w-full mt-2">
            <label
              htmlFor="assignee"
              className="block text-gray-700 font-semibold mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500 capitalize w-full max-w-[335px]">
              <option value="" disabled>
                Status
              </option>
              {status.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              onClick={resetForm}
              type="button"
              className=" text-blue-700 rounded px-4 py-2 transition-colors duration-300 hover:bg-gray-400 mr-4 hover:text-white flex items-center">
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`tracking-wide font-semibold bg-blue-900 text-gray-100 px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}>
              {loading ? ( // Show loader when loading is true
                <div className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-gray-100"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12c0-1.104.896-2 2-2h12c1.104 0 2 .896 2 2s-.896 2-2 2H6c-1.104 0-2-.896-2-2z"
                    />
                  </svg>
                  {taskId ? "Updating..." : "Adding..."}
                </div>
              ) : taskId ? (
                <>
                  <MdCheck className="mr-2" />
                  Update
                </>
              ) : (
                <>Save</>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Assignee</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Tasks.map((task) => (
              <tr
                key={task._id}
                className="hover:bg-gray-100 transition-colors duration-200 text-center">
                <td className="border border-gray-300 px-4 py-2">
                  {task.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {task.description}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    name="assignee"
                    value={task.assignee}
                    onChange={(e) =>
                      handleAssigneeChange(task._id, e.target.value, task)
                    }
                    className="border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500">
                    <option value="" disabled>
                      Select Assignee
                    </option>
                    {assignee.map((user) => (
                      <option key={user.name} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    name="status"
                    value={task.status}
                    onChange={(e) =>
                      updateStatusChange(task._id, e.target.value, task)
                    }
                    required
                    className="border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500 capitalize">
                    <option value="" disabled>
                      Status
                    </option>
                    {status.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => handleEdit(task)}
                    className="bg-yellow-500 text-white text-xl rounded-full px-2 py-2 mr-2 transition-colors duration-300 hover:bg-yellow-600">
                    <BiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="bg-red-500 text-white text-xl rounded-full px-2 py-2 transition-colors duration-300 hover:bg-red-600">
                    <MdDeleteOutline />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Task;
