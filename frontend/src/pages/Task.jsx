import { AiOutlineClose } from "react-icons/ai";
import { AiFillEye } from "react-icons/ai";
import API_URL from "../config/config";
import { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { MdCheck, MdDeleteOutline } from "react-icons/md";
import { ToastContainer } from "react-toastify";
import { fetchEmployees } from "../services/employeeService";
import {
  addTasks,
  deleteTasks,
  fetchTasks,
  updateTasks,
  uploadDocument,
} from "../services/taskService";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "../utils/toastUtils";
import { useConfirmAlert } from "react-use-confirm-alert";
import TaskModal from "./TaskModal";

const Task = () => {
  const confirm = useConfirmAlert();
  const status = ["completed", "pending"];
  const [assignee, setAssignee] = useState([]);
  const [taskId, setTaskId] = useState("");
  const [touched, setTouched] = useState({});

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [Tasks, setTasks] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "pending",
    assignee: "",
    file: [],
  });

  const handleRowClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchTasksData();
  }, []);

  useEffect(() => {
    fetchEmployeesData();
  }, []);

  const fetchEmployeesData = async () => {
    try {
      const response = await fetchEmployees();
      setAssignee(response.data);
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  // const handleDocumentChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   setDocuments((prevDocuments) => [...prevDocuments, ...files]);
  // };
  const fetchTasksData = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (error) {
      showErrorToast(error.message);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      if (taskId) {
        // updateTask(taskId, { ...formData, file });
        updateTask(taskId, formData);
      } else {
        const response = await addTasks(formData);
        showSuccessToast(response.message);
      }
      fetchTasksData();
      resetForm();
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    const fieldError = validateField(name, formData[name]);
    setErrors({ ...errors, [name]: fieldError });
  };

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "name":
        if (!value) {
          return "Name is required.";
        } else if (value.length < 4) {
          return "Name should be at least 4 characters.";
        }
        break;
      case "description":
        if (!value) {
          return "Description is required.";
        }
        break;

      case "assignee":
        if (!value) {
          return "Assignee is required.";
        }
        break;
      default:
        break;
    }
    return "";
  };

  const validateForm = (data) => {
    const newErrors = {};

    Object.keys(data).forEach((key) => {
      const error = validateField(key, data[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    return newErrors;
  };

  const updateTask = async (id, data) => {
    try {
      const response = await updateTasks(id, {
        ...data,
        assignee: data.assignee._id ? data.assignee._id : data.assignee,
      });
      setTaskId(null);
      showSuccessToast(response.message);
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const handleEdit = (task) => {
    setFormData({
      name: task.name,
      description: task.description,
      status: task.status,
      assignee: task.assignee,
      file: task.file,
    });
    setTaskId(task._id);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      assignee: "",
      status: "",
      file: [],
    });
    setTaskId(null);
    setErrors({});
  };

  const handleAssigneeChange = async (taskId, assignee, task) => {
    const updatedTask = {
      name: task.name,
      description: task.description,
      status: task.status,
      assignee: task.assignee,
    };
    await updateTask(taskId, updatedTask);
    await fetchTasksData();
    resetForm();
  };

  const handleDocumentChange = async (e) => {
    // Prepare form data to send to the API
    const newData = new FormData();
    if (e.target.files.length > 0) {
      setLoading(true);
      newData.append("file", e.target.files[0]);

      try {
        const response = await uploadDocument(newData);
        formData.file = [...formData.file, response.data];
        console.log(formData);
      } catch (error) {
        showErrorToast(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      showErrorToast("No file selected.");
    }
  };
  const updateStatusChange = async (taskId, status, task) => {
    const updatedTask = {
      name: task.name,
      description: task.description,
      status: task.status,
      assignee: task.assignee,
    };
    await updateTask(taskId, updatedTask);
    await fetchTasksData();
    console.log(updatedTask);
    resetForm();
  };

  const handleDelete = async (id) => {
    confirm({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this task?",
      onConfirm: async () => {
        try {
          const response = await deleteTasks(id);
          await fetchTasksData();
          showWarningToast(response.message);
        } catch (error) {
          console.log(error);
          showErrorToast(error.message);
        }
      },
      onCancel: {},
    });
  };

  const removeFiles = (index) => {
    if (!formData.file.length) return;
    const updatedFiles = formData.file.filter((_, i) => i !== index);
    setFormData({ ...formData, file: updatedFiles });
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
                onBlur={handleBlur}
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500 w-full"
              />
              {errors.name && touched.name && (
                <p className="text-red-500 text-sm mt-0.5 ml-2">
                  {errors.name}
                </p>
              )}
            </div>
            <div className="w-full">
              <label
                htmlFor="assignee"
                className="block text-gray-700 font-semibold mb-2">
                Assignee
              </label>
              <select
                name="assignee"
                onBlur={handleBlur}
                value={formData.assignee}
                onChange={handleChange}
                required
                className="border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500 w-full">
                <option value="" disabled>
                  Select Assignee
                </option>
                {assignee.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
              {errors.assignee && touched.assignee && (
                <p className="text-red-500 text-sm mt-0.5 ml-2">
                  {errors.assignee}
                </p>
              )}
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
              onBlur={handleBlur}
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              required
              className="border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500 w-full"
            />
            {errors.description && touched.assignee && (
              <p className="text-red-500 text-sm mt-0.5 ml-2">
                {errors.description}
              </p>
            )}
          </div>
          {taskId && (
            <div className="w-full mt-2">
              <label
                htmlFor="assignee"
                className="block text-gray-700 font-semibold mb-2">
                Status
              </label>
              <select
                name="status"
                onBlur={handleBlur}
                value={formData.status}
                onChange={handleChange}
                required
                className="border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500 capitalize w-full max-w-[335px]">
                {status.map((status, index) => (
                  <option key={index} value={status} selected>
                    {status}
                  </option>
                ))}
              </select>
              {errors.status && touched.status && (
                <p className="text-red-500 text-sm mt-0.5 ml-2">
                  {errors.status}
                </p>
              )}
            </div>
          )}
          <div className="w-full">
            <label
              htmlFor="file"
              className="block text-gray-700 font-semibold mb-2">
              Upload Document
            </label>
            <input
              type="file"
              name="file"
              onChange={handleDocumentChange}
              className="border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500 w-full"
            />

            {formData.file.length > 0 && (
              <div className="mt-5">
                <h4>Uploaded Documents:</h4>
                <ul className="max-w-[335px] flex flex-col gap-2 mt-2">
                  {formData.file.map((doc, index) => (
                    <li
                      key={index}
                      className="p-3 border rounded-lg flex items-center gap-3 justify-between">
                      <a
                        className="text-blue-600 underline line-clamp-1"
                        href={`${API_URL}/${doc.path}`}
                        target="_blank"
                        download>
                        {doc.filename}
                      </a>
                      <div
                        className="cursor-pointer"
                        onClick={() => removeFiles(index)}>
                        <AiOutlineClose />
                      </div>
                    </li> // Display the file name
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex justify-end mt-4">
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
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">
                  Description
                </th>
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
                  <td className="border border-gray-300 px-4 py-2 text-nowrap">
                    {task.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-nowrap">
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
                  <td className="border border-gray-200 px-4 py-3 flex justify-center">
                    <button
                      onClick={() => handleRowClick(task)}
                      className="bg-blue-500 text-white text-xl rounded-full px-2 py-2 mr-2 transition-colors duration-300 hover:bg-yellow-600">
                      <AiFillEye />
                    </button>

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
      {selectedTask ? (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={selectedTask}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default Task;
