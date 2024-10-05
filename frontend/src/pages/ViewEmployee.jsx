import { useEffect, useState } from "react";
import { fetchTasks } from "../services/taskService";
import { showErrorToast } from "../utils/toastUtils";
import { ToastContainer } from "react-toastify";
const ViewEmployee = () => {
  const initialEmployees = [];
  const [Tasks, setTasks] = useState(initialEmployees);
  const status = ["completed", "pending", "in-progress"];
  const [employees] = useState(initialEmployees);
  useEffect(() => {
    fetchAllTasks();
  }, []);

  const fetchAllTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const pendingTasks = employees.filter(
    (employee) => employee.onboardingStatus === "Pending"
  ).length;

  const completedTasks = employees.filter(
    (employee) => employee.onboardingStatus === "Completed"
  ).length;

  //   const handleAssigneeChange = async (taskId, assignee, task) => {
  //     // await updateTask(taskId, { ...task, assignee });
  //     await fetchAllTasks();
  //   };

  //   const updateStatusChange = async (taskId, status, task) => {
  //     // await updateTask(taskId, { ...task, status });
  //     await fetchAllTasks();
  //   };

  return (
    <div>
      <ToastContainer />
      <div className="grid grid-cols-4 mb-4">
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow-md  mr-2">
          <h3 className="text-lg font-semibold">Pending Tasks</h3>
          <p className="text-3xl">{pendingTasks}</p>
        </div>
        <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow-md  ml-2">
          <h3 className="text-lg font-semibold">Completed Tasks</h3>
          <p className="text-3xl">{completedTasks}</p>
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
                className="hover:bg-gray-100 transition-colors duration-200 text-center">
                <td className="border border-gray-300 px-4 py-2">
                  {task.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {task.description}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {task.created_by?.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    name="status"
                    value={task.status}
                    // onChange={(e) =>
                    //   updateStatusChange(task._id, e.target.value, task)
                    // }
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewEmployee;
