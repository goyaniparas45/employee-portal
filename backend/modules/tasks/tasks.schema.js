const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name cannot be empty"],
      minlength: [3, "Name must be at least 3 characters long"],
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description cannot be empty"],
      minlength: [3, "Description must be at least 3 characters long"],
    },
    status: {
      type: String,
      required: [true, "Task status cannot be empty"],
      default: "pending",
    },
    assignee: {
      type: String,
      required: [true, "Assignee cannot be empty"],
    },
    documents: [String],
    created_by: String,
  },
  { timestamps: true }
);

const Task = mongoose.model("tbl_task", taskSchema);

module.exports = Task;
