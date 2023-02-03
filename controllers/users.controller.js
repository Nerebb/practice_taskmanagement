const { validationResult } = require("express-validator");
const { sendResponse, AppError } = require("../helpers/utils");
const { User } = require("../models/User");
const AdminID = process.env.ADMIN_ID;
const userController = {};

userController.getUser = async (req, res, next) => {
  const { name, role } = req.query;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(400, errors.array()[0].msg);
    }

    let getUsers;
    let query = { isDeleted: false };
    if (name) query.name = name;
    if (role) query.role = role;

    getUsers = await User.find(query);

    if (!getUsers.length > 0) throw new AppError(400, "User not found");

    sendResponse(res, 200, true, { getUsers }, null, "Get users success");
  } catch (error) {
    next(error);
  }
};

userController.getUserById = async (req, res, next) => {
  const { id } = req.params;
  const { getAllTask } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(400, errors.array()[0].msg);
    }

    let getUser;

    if (Boolean(getAllTask)) {
      getUser = await User.findById(id).populate({
        path: "tasks",
        match: { isDeleted: false },
      });
    } else {
      getUser = await User.findById(id);
    }

    if (!getUser) throw new AppError(400, "User or Tasks not found");

    sendResponse(
      res,
      200,
      true,
      Boolean(getAllTask) ? { tasks: getUser.tasks } : { getUser },
      null,
      "Get users success"
    );
  } catch (error) {
    next(error);
  }
};

userController.createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(400, errors.array()[0].msg);
    }
    const newUser = await User.create(req.body);

    sendResponse(
      res,
      200,
      true,
      { createdUser: newUser },
      null,
      "Create user success"
    );
  } catch (error) {
    next(error);
  }
};

userController.modifyUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(400, errors.array()[0].msg);
    }

    delete req.body.curId;

    const modifiedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!modifiedUser) throw new AppError(400, "User not found");

    sendResponse(
      res,
      200,
      true,
      { modifiedUser: modifiedUser },
      null,
      "User has been modified"
    );
  } catch (error) {
    next(error);
  }
};

userController.deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(400, errors.array()[0].msg);
    }

    if (id === AdminID) throw new AppError(400, "Cannot delete admin");

    const deletedUser = await User.findById(id);

    if (deletedUser.isDeleted)
      throw new AppError(400, "User had been deleted already");
    deletedUser.isDeleted = true;

    await deletedUser.save();

    sendResponse(
      res,
      200,
      true,
      { modifiedUser: deletedUser },
      null,
      "User has been deleted"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = userController;
