// import { useState } from "react";
// import { signup } from "../services/authService";
// import { Link } from "react-router-dom";
// import { IoPersonSharp } from "react-icons/io5";
// import { useNavigate } from "react-router-dom";
// const Signup = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const [error, setError] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newErrors = validateForm(formData);
//     setError(newErrors);
//     if (Object.keys(newErrors).length > 0) {
//       console.log("Form submission failed due to validation errors.");
//       return;
//     }

//     try {
//       const data = await signup(formData);
//       console.log(data);
//       navigate("/admin/employees");
//     } catch (err) {
//       console.log(err);
//       setError({ signup: "Signup failed, please try again." });
//     }
//   };

//   const validateForm = (data) => {
//     const errors = {};

//     if (!data.name.trim()) {
//       errors.name = "name is required";
//     } else if (data.name.length < 4) {
//       errors.name = "Name must be at least 4 characters long";
//     }

//     if (!data.email.trim()) {
//       errors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(data.email)) {
//       errors.email = "Email is invalid";
//     }

//     if (!data.password) {
//       errors.password = "Password is required";
//     } else if (data.password.length < 8) {
//       errors.password = "Password must be at least 8 characters long";
//     }

//     return errors;
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div className="p-6 sm:p-12">
//         <div className="flex flex-col items-center">
//           <IoPersonSharp size={50} className="text-blue-900" />
//           <div className="text-center">
//             <h1 className="text-2xl xl:text-4xl font-extrabold text-blue-900 py-1">
//               Sign up
//             </h1>
//             <p className="text-[12px] text-gray-500">
//               Hey enter your details to create your account
//             </p>
//           </div>
//           <div className="w-full flex-1 mt-8">
//             <div className="mx-auto max-w-xs flex flex-col gap-4">
//               <div>
//                 <input
//                   className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   placeholder="Enter your name"
//                   required
//                 />
//                 {error.name && (
//                   <span className="text-red-600 text-xs ml-3 mt-1">
//                     {error.name}
//                   </span>
//                 )}
//               </div>
//               <div>
//                 <input
//                   className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
//                   type="email"
//                   name="email"
//                   placeholder="Enter your email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                 />
//                 {error.email && (
//                   <span className="text-red-600 text-xs ml-3 mt-1">
//                     {error.email}
//                   </span>
//                 )}
//               </div>
//               <div>
//                 <input
//                   className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="Password"
//                   required
//                 />
//                 {error.password && (
//                   <span className="text-red-600 text-xs ml-3 mt-1">
//                     {error.password}
//                   </span>
//                 )}
//               </div>

//               <button
//                 type="submit"
//                 className="mt-5 tracking-wide font-semibold bg-blue-900 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
//                 <span className="ml-3">Sign Up</span>
//               </button>
//               <p className="mt-6 text-xs text-gray-600 text-center">
//                 Already have an account?{" "}
//                 <Link to="/login">
//                   <span className="text-blue-900 font-semibold">Sign in</span>
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default Signup;

// import { MdDeleteOutline } from "react-icons/md";
// import { BiEdit } from "react-icons/bi";
// import { useEffect, useState } from "react";
// import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
// import { ToastContainer } from "react-toastify";
// import { MdAdd, MdCheck } from "react-icons/md";
// const Task = () => {
//   const assigneeOptions = [
//     { id: 1, name: "User A" },
//     { id: 2, name: "User B" },
//     { id: 3, name: "User C" },
//   ];

//   const initialTask = [];

//   const StatusOptions = ["Completed", "Pending"];

//   const [Task, setTask] = useState(initialTask);
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     status: "",
//     assignee: "",
//   });

//   const [isEditing, setIsEditing] = useState(false);
//   const [userRole, setUserRole] = useState("");

//   useEffect(() => {
//     const storedRole = localStorage.getItem("role");
//     setUserRole(storedRole);
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (userRole === "hr" && Task.length >= 1 && !isEditing) {
//       showErrorToast("HR can see the task.");
//       return;
//     }

//     if (isEditing) {
//       setTask(
//         Task.map((task) =>
//           task.id === formData.id
//             ? {
//                 ...task,
//                 name: formData.name,
//                 description: formData.description,
//                 assignee: formData.assignee,
//                 status: formData.status,
//               }
//             : task
//         )
//       );
//       setIsEditing(false);
//       showSuccessToast("Task updated successfully!");
//     } else {
//       const newtask = {
//         id: Task.length + 1,
//         name: formData.name,
//         description: formData.description,
//         assignee: formData.assignee,
//         status: formData.status,
//       };
//       setTask([...Task, newtask]);
//       showSuccessToast("Task added successfully!");
//     }

//     setFormData({
//       id: "",
//       name: "",
//       description: "",
//       assignee: "",
//       status: "",
//     });
//   };

//   const handleEdit = (task) => {
//     setFormData(task);
//     setIsEditing(true);
//   };

//   const handleDelete = (id) => {
//     setTask(Task.filter((task) => task.id !== id));
//   };

//   return (
//     <div className="p-6">
//       <ToastContainer />
//       <h2 className="text-2xl font-bold mb-4 text-left">Task </h2>
//       <div className="bg-white shadow-md rounded-lg p-6 mb-4">
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Name"
//               required
//               className="border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500"
//             />
//             <input
//               type="text"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               placeholder="Description"
//               required
//               className="border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500"
//             />

//             <select
//               name="assignee"
//               value={formData.assignee}
//               onChange={handleChange}
//               required
//               className="border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500">
//               <option value="" disabled>
//                 Select Assignee
//               </option>
//               {assigneeOptions.map((user) => (
//                 <option key={user.id} value={user.name}>
//                   {user.name}
//                 </option>
//               ))}
//             </select>

//             <select
//               name="status"
//               value={formData.status}
//               onChange={handleChange}
//               required
//               className="border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500">
//               <option value="" disabled>
//                 Status
//               </option>
//               {StatusOptions.map((status, index) => (
//                 <option key={index} value={status}>
//                   {status}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="flex justify-end">
//             <button
//               type="submit"
//               className="bg-blue-600 text-white rounded px-4 py-2 transition-colors duration-300 hover:bg-blue-700 flex items-center">
//               {isEditing ? (
//                 <>
//                   <MdCheck className="mr-2" />
//                   Update Task
//                 </>
//               ) : (
//                 <>
//                   <MdAdd className="mr-2" />
//                   Add Task
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>

//       <div className="bg-white shadow-md rounded-lg overflow-hidden">
//         <table className="min-w-full border border-gray-300">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="border border-gray-300 px-4 py-2">Name</th>
//               <th className="border border-gray-300 px-4 py-2">Description</th>
//               <th className="border border-gray-300 px-4 py-2">Assignee</th>
//               <th className="border border-gray-300 px-4 py-2">Status</th>
//               <th className="border border-gray-300 px-4 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Task.map((task) => (
//               <tr
//                 key={task.id}
//                 className="hover:bg-gray-100 transition-colors duration-200 text-center">
//                 <td className="border border-gray-300 px-4 py-2">
//                   {task.name}
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   {task.description}
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   {/* Assignee Dropdown for editing */}
//                   <select
//                     value={task.assignee}
//                     onChange={(e) =>
//                       handleAssigneeChange(task.id, e.target.value)
//                     }
//                     className="border rounded px-2 py-1 focus:outline-none focus:ring focus:ring-blue-500">
//                     {assigneeOptions.map((user) => (
//                       <option key={user.id} value={user.name}>
//                         {user.name}
//                       </option>
//                     ))}
//                   </select>
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   {/* Status Dropdown for editing */}
//                   <select
//                     value={task.status}
//                     onChange={(e) =>
//                       handleStatusChange(task.id, e.target.value)
//                     }
//                     className="border rounded px-2 py-1 focus:outline-none focus:ring focus:ring-blue-500">
//                     {StatusOptions.map((status, index) => (
//                       <option key={index} value={status}>
//                         {status}
//                       </option>
//                     ))}
//                   </select>
//                 </td>

//                 <td className="border border-gray-300 px-4 py-2 text-center">
//                   <button
//                     onClick={() => handleEdit(task)}
//                     className="bg-yellow-500 text-white text-xl rounded-full px-2 py-2 mr-2 transition-colors duration-300 hover:bg-yellow-600">
//                     <BiEdit />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(task.id)}
//                     className="bg-red-500 text-white text-xl rounded-full px-2 py-2 transition-colors duration-300 hover:bg-red-600">
//                     <MdDeleteOutline />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Task;
