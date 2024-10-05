import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ConfirmAlertProvider } from "react-use-confirm-alert";

createRoot(document.getElementById("root")).render(
  <ConfirmAlertProvider>
    <App />{" "}
  </ConfirmAlertProvider>
);
