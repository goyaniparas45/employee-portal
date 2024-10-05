import PropTypes from "prop-types";
import API_URL from "../config/config";
import { AiOutlineClose } from "react-icons/ai";
import { useEffect, useState } from "react";
import { updateTasks } from "../services/taskService";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";

const TaskModal = ({ isOpen, onClose, task }) => {
  useEffect(() => init(), []);
  const [Task, setTask] = useState({});
  if (!isOpen) return null;
  const init = () => {
    setTask(task);
  };
  const removeFiles = (index) => {
    if (!Task.file.length) return;
    const updatedFiles = Task.file.filter((_, i) => i !== index);
    setTask({ ...Task, file: updatedFiles });
    updateTask(Task._id, { ...Task, file: updatedFiles });
  };

  const updateTask = async (id, data) => {
    try {
      const response = await updateTasks(id, {
        ...data,
        assignee: data.assignee._id ? data.assignee._id : data.assignee,
      });
      showSuccessToast(response.message);
    } catch (error) {
      showErrorToast(error.message);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="bg-white rounded-lg shadow-lg z-10 p-6 lg:w-[720px] lg:min-h-[420px] overflow-y-auto relative">
        <h2 className="text-xl font-bold mb-4">{Task.name}</h2>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Documents</h3>
          {Task.file && Task.file.length > 0 ? (
            <div>
              {Task.file.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between mt-2 max-w-[335px] border rounded-lg py-3 px-2">
                  <a
                    className="text-blue-500 underline"
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
                </div>
              ))}
            </div>
          ) : (
            <p>No file available for this task.</p>
          )}
        </div>

        <div className="absolute bottom-6 right-6">
          <button
            onClick={onClose}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

TaskModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  task: PropTypes.shape({
    name: PropTypes.string.isRequired,
    file: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default TaskModal;
