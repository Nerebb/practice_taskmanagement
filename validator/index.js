const validator = {};
const allowedFilterRole = ["employee", "admin"];
const allowedStatus = ["pending", "working", "review", "done", "archive"];
const AdminID = process.env.ADMIN_ID;

validator.id = {
  notEmpty: {
    errorMessage: "User haven't login or request id field not found",
  },
  isMongoId: {
    errorMessage: "ID not valid",
  },
};

validator.Username = {
  custom: {
    options: (value) => {
      if (!value) {
        return true;
      }
      if (value.includes("admin")) {
        throw error;
      }
      return true;
    },
    errorMessage: "Inapproriate name",
  },
  trim: true,
  customSanitizer: {
    options: (value) => {
      let sanitizedValue = value.toString().toLowerCase();
      return sanitizedValue;
    },
  },
};

validator.Taskname = {
  trim: true,
  customSanitizer: {
    options: (value, { req }) => {
      let sanitizedValue = value.toString().toLowerCase();
      return sanitizedValue;
    },
  },
};

validator.role = {
  custom: {
    options: (value) => {
      console.log(
        "🚀 ~ file: index.js:32 ~ allowedFilterRole.includes(value)",
        allowedFilterRole.includes(value)
      );
      if (!value) return true;
      if (!allowedFilterRole.includes(value)) throw error;
      return true;
    },
    errorMessage: "Invalid users role",
  },
};

validator.isAdmin = {
  custom: {
    options: (value, { req }) => req.body.curId === AdminID,
    errorMessage: "Current User is not admin",
  },
};

validator.description = {
  customSanitizer: {
    options: (value) => {
      if (value) {
        return value.toString().toLowerCase();
      }
    },
  },
};

validator.status = {
  custom: {
    options: (value) => {
      if (!value) return true;
      if (!allowedStatus.includes(value)) {
        throw error;
      }
      return true;
    },
    errorMessage: "Status is not valid",
  },
};

validator.ref = {
  ...validator.isAdmin,
};

validator.sortBy = {
  isObject: {
    errorMessage: "sortBy must be a object with value: 1 or -1",
  },
  optional: true,
  custom: {
    options: (value, { req }) => {
      if (
        !Object.values(value).some((i) => Number(i) === 1 || Number(i) === -1)
      ) {
        throw error;
      }
      return true;
    },
    errorMessage:
      "sortBy must be a object <sortBy>: 1 or -1, 1 for asc, -1 for desc",
  },
};

module.exports = validator;
