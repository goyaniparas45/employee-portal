import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const showSuccessToast = (message) => {
  toast.success(message, {});
};

export const showErrorToast = (message) => {
  toast.error(message, {});
};

export const showInfoToast = (message) => {
  toast.info(message, {});
};

export const showWarningToast = (message) => {
  toast.warn(message, {});
};
