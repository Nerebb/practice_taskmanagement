const validator = require(".");
const { Task } = require("../models/task");
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
  assignee: {
    in: ["body"],
    ...validator.assignee,
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

  assignee: {
    in: ["body"],
    ...validator.assignee,
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
  createAt: {
    in: ["query"],
    custom: {
      options: (value, { req }) => {
        if (!value) {
          return true;
        } else if (!allowedFilter.includes(value) || req.query.updateAt) {
          throw error;
        }
        return value;
      },
      errorMessage:
        "createAt/updateAt are unique and only accept value: asc or desc",
    },
  },
  updateAt: {
    in: ["query"],
    custom: {
      options: (value, { req }) => {
        if (!value) {
          return true;
        } else if (!allowedFilter.includes(value) || req.query.createAt) {
          throw error;
        }
        return value;
      },
      errorMessage:
        "createAt/updateAt are unique and only accept value: asc or desc",
    },
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
