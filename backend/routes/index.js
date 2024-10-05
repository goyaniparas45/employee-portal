const express = require("express");
const employeeRoutes = require("../modules/employee/employee.routes");
const taskRoutes = require("../modules/tasks/tasks.routes");
const authRoutes = require("../modules/auth/auth.routes");
const auth = require("./../middlewares/auth.middleware");
const upload = require("./../middlewares/upload.middleware");
const uploadDocuments = require("./../modules/common/upload");
const dashboardData = require("./../modules/dashboard/dashboard.controller");
const getAllRoles = require("../modules/roles/roles.controller");
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/employee", auth, employeeRoutes);
router.use("/task", auth, taskRoutes);
router.get("/dashboard", auth, dashboardData);
router.get("/roles", auth, getAllRoles);
router.post("/upload", upload.single("file"), uploadDocuments);

module.exports = router;
