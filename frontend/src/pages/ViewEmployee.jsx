import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { fetchDashboardData } from "../services/dashboardService";
import { fetchTasks, updateTasks } from "../services/taskService";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";

const ViewEmployee = () => {
  const initialEmployees = [];
  const [Tasks, setTasks] = useState(initialEmployees);
  const [dashboardData, setDashboardData] = useState({});
  const status = ["completed", "pending"];

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    fetchAllTasks();
    const data = await fetchDashboardData();
    setDashboardData(data);
  };

  const fetchAllTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const updateStatusChange = async (taskId, status, task) => {
    try {
      const response = await updateTasks(taskId, { ...task, status });
      showSuccessToast(response.message);
      init();
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="grid grid-cols-4 mb-4">
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow-md  mr-2">
          <h3 className="text-lg font-semibold">Pending Tasks</h3>
          <p className="text-3xl">{dashboardData.task_pending}</p>
        </div>
        <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow-md  ml-2">
          <h3 className="text-lg font-semibold">Completed Tasks</h3>
          <p className="text-3xl">{dashboardData.task_completed}</p>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Assigned by</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {Tasks.map((task) => (
              <tr
                key={task._id}
                className="hover:bg-gray-100 transition-colors duration-200 text-center"
              >
                <td className="border border-gray-300 px-4 py-2">
                  {task.name ? task.name : "--"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {task.description ? task.description : "--"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {task.created_by?.name ? task.created_by?.name : "--"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    name="status"
                    value={task.status}
                    onChange={(e) =>
                      updateStatusChange(task._id, e.target.value, task)
                    }
                    required
                    className="border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500 capitalize"
                  >
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewEmployee;
