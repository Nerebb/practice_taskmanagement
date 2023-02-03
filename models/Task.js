const mongoose = require("mongoose");
//Create schema
const taskSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "working", "review", "done", "archive"],
      default: "pending",
    },
    assignee: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const tasksField = Object.keys(taskSchema.obj);

//Create and export model

const Task = mongoose.model("Task", taskSchema);

module.exports = { Task, tasksField };

const test = () => {};
