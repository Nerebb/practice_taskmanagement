const validator = require(".");
const { Task } = require("../models/Task");
const { User } = require("../models/User");
const userValidateSchema = require("./userValidate");
const allowedFilter = ["asc", "desc"];
const taskValidateSchema = {};

taskValidateSchema.modifyTaskValidate = {
  name: {
    in: ["body"],
    ...validator.Taskname,
  },
  description: {
    in: ["body"],
    ...validator.description,
  },
  status: {
    in: ["body"],
    ...validator.status,
  },
  curId: {
    in: ["body"],
    ...validator.id,
  },
  ref: {
    in: ["body"],
    ...validator.ref,
  },
};

taskValidateSchema.createTaskValidate = {
  name: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Task name required",
    },
    ...validator.Taskname,
  },

  description: {
    in: ["body"],
    ...validator.description,
  },

  status: {
    in: ["body"],
    ...validator.status,
  },

  ref: {
    in: ["body"],
    ...validator.ref,
  },
};

taskValidateSchema.getTaskValidate = {
  status: {
    in: ["query"],
    ...validator.status,
  },
  name: {
    in: ["query"],
    ...validator.Taskname,
  },
  sortBy: {
    in: ["body"],
    ...validator.sortBy,
  },
};

taskValidateSchema.deleteTaskValidate = {
  id: {
    in: ["params"],
    ...validator.id,
    ...validator.isAdmin,
  },
};

module.exports = taskValidateSchema;
