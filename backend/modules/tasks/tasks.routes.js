const express = require("express");
const {
  getAllTasks,
  addTask,
  updateTask,
  deleteTask,
  getTask,
} = require("./tasks.controller");

const router = express.Router();

router.get("/", getAllTasks);
router.get("/:id", getTask);
router.post("/", addTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
