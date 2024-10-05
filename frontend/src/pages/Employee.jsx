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
  addEmployee,
  updateEmployee,
  fetchEmployees,
  deleteEmployee,
  fetchRoles,
} from "../services/employeeService";
import { useConfirmAlert } from "react-use-confirm-alert";

const Employee = () => {
  const confirm = useConfirmAlert();
  const initialEmployees = [];
  const [loading, setLoading] = useState(false);
  const departmentOptions = ["IT", "Marketing", "Dispatch"];
  const onboardingStatusOptions = ["Completed", "Pending"];
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [employees, setEmployees] = useState(initialEmployees);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    password: "",
    onboardingStatus: "",
    login_method: "email",
  });
  const [userRole, setUserRole] = useState([]);
  const [empId, setEmpId] = useState();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const roles = await fetchRoles();
      setUserRole(roles);
      getEmployees();
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const getEmployees = async () => {
    const response = await fetchEmployees();
    setEmployees(response.data);
  };

  const generatePassword = (name, email) => {
    const randomNumbers = Math.floor(100 + Math.random() * 900).toString();
    return `${name}${email.split("@")[0]}${randomNumbers}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const generatedPassword = generatePassword(formData.name, formData.email);
    const employeeData = {
      ...formData,
      password: generatedPassword,
      email: formData.email.toLowerCase(),
    };
    setLoading(true);
    try {
      if (empId) {
        updateEmployeeData(empId, formData);
      } else {
        await addEmployee(employeeData);
        showSuccessToast("Employee added successfully!");
      }
      getEmployees();
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

      case "email":
        if (!value) {
          return "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          return "Email is invalid.";
        }
        break;

      case "role":
        if (!value) {
          return "Role is required.";
        }
        break;

      case "department":
        if (!value) {
          return "Department is required.";
        }
        break;

      case "onboardingStatus":
        if (!value) {
          return "Onboarding status is required.";
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

  const updateEmployeeData = async (id, data) => {
    try {
      const response = await updateEmployee(id, data);
      setEmpId(null);
      showSuccessToast(response.message);
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const handleEdit = (employee) => {
    setFormData(employee);
    setEmpId(employee._id);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "",
      department: "",
      password: "",
      onboardingStatus: "",
      login_method: "email",
    });
    setEmpId(null);
  };

  const updateStatusChange = async (id, status, employee) => {
    await updateEmployeeData(id, { ...employee, status });
    getEmployees();
    resetForm();
  };

  const handleDelete = async (id) => {
    confirm({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete employee?",
      onConfirm: async () => {
        try {
          const response = await deleteEmployee(id);
          getEmployees();
          showWarningToast(response.message);
        } catch (error) {
          showErrorToast(error.message);
        }
      },
      onCancel: {},
    });
  };
  return (
    <div className="p-6">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4 text-left">Employee</h2>
      <div className="bg-white shadow-md rounded-lg p-6 mb-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                onBlur={handleBlur}
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500 w-full"
              />
              {touched.name && errors.name && (
                <p className="text-red-500 text-sm mt-0.5 ml-2">
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                onBlur={handleBlur}
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className={`border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500  w-full ${
                  formData.email ? "lowercase" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-0.5 ml-2">
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Role
              </label>
              <select
                name="role"
                onBlur={handleBlur}
                value={formData.role}
                onChange={handleChange}
                required
                className="border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500 w-full">
                <option value="" disabled>
                  Select Role
                </option>
                {userRole.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.name}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-0.5 ml-2">
                  {errors.role}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Department
              </label>
              <select
                name="department"
                onBlur={handleBlur}
                value={formData.department}
                onChange={handleChange}
                required
                className="border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500 w-full">
                <option value="" disabled>
                  Select Department
                </option>
                {departmentOptions.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="text-red-500 text-sm mt-0.5 ml-2">
                  {errors.department}
                </p>
              )}
            </div>
            {empId && (
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Status
                </label>
                <select
                  name="onboardingStatus"
                  onBlur={handleBlur}
                  value={formData.onboardingStatus}
                  onChange={handleChange}
                  required
                  className="border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500 w-full">
                  <option value="" disabled>
                    Onboarding Status
                  </option>
                  {onboardingStatusOptions.map((OnboardingStatus) => (
                    <option key={OnboardingStatus} value={OnboardingStatus}>
                      {OnboardingStatus}
                    </option>
                  ))}
                </select>
                {errors.onboardingStatus && (
                  <p className="text-red-500 text-sm mt-0.5 ml-2">
                    {errors.onboardingStatus}
                  </p>
                )}
              </div>
            )}
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
                  {empId ? "Updating..." : "Adding..."}
                </div>
              ) : empId ? (
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
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Role</th>
                <th className="border border-gray-300 px-4 py-2">Department</th>
                <th className="border border-gray-300 px-4 py-2">
                  Onboarding Status
                </th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr
                  key={employee._id}
                  className="hover:bg-gray-100 transition-colors duration-200 text-center">
                  <td className="border border-gray-300 px-4 py-2">
                    {employee.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {employee.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 capitalize">
                    {employee.role}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {employee.department}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <select
                      name="status"
                      value={employee.status}
                      onChange={(e) =>
                        updateStatusChange(
                          employee._id,
                          e.target.value,
                          employee
                        )
                      }
                      required
                      className="border rounded px-2 py-1 focus:outline-none focus:ring focus:ring-blue-500 capitalize">
                      <option value="" disabled>
                        Status
                      </option>
                      {onboardingStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center flex justify-center">
                    <button
                      onClick={() => handleEdit(employee)}
                      className="bg-yellow-500 text-white text-xl rounded-full px-2 py-2 mr-2 transition-colors duration-300 hover:bg-yellow-600">
                      <BiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(employee._id)}
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
    </div>
  );
};

export default Employee;
