const validator = require(".");
const { User } = require("../models/User");

const userValidateSchema = {};
const allowedFilters = ["name", "role", "curId"];

userValidateSchema.CreateUserValidate = {
  name: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Name field required",
    },
    ...validator.Username,
  },

  role: {
    in: ["body"],
    isEmpty: {
      errorMessage: "You are not allowed to set role",
    },
  },

  tasks: {
    isEmpty: {
      errorMessage: "You can only assign task in tasks collections",
    },
    customSanitizer: {
      options: (value, { req }) => {
        if (!value) return;
        return true;
      },
    },
  },
};

userValidateSchema.ModifyUserValidate = {
  id: {
    in: ["params"],
    ...validator.id,
  },

  curId: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Login required",
    },
    ...validator.isAdmin,
  },

  name: { in: ["body"], ...validator.Username },
  role: {
    in: ["body"],
    ...validator.role,
  },
};

userValidateSchema.DeleteUserValidate = {
  id: {
    in: ["params"],
    ...validator.id,
  },
  curId: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Login required",
    },
    ...validator.isAdmin,
  },
};

userValidateSchema.GetUserValidate = {
  name: {
    in: ["query"],
    ...validator.Username,
  },
  role: {
    in: ["query"],
    ...validator.role,
  },
};

userValidateSchema.GetUserByIdValidate = {
  id: {
    in: ["params"],
    ...validator.id,
  },
  getAllTasks: {
    in: ["query"],
    isBoolean: {
      errorMessage: "getAllTasks must have type boolean",
    },
    optional: true,
  },
};

module.exports = userValidateSchema;
