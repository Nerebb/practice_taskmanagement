const { validationResult } = require("express-validator");
const { sendResponse, AppError } = require("../helpers/utils");
const { ObjectId } = require("mongoose").Types;
const { Task } = require("../models/Task");
const { User } = require("../models/User");
const AdminID = process.env.ADMIN_ID;

const taskController = {};

taskController.getTask = async (req, res, next) => {
  const { status, createAt, updateAt } = req.query;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(400, errors.array()[0].msg);
    }

    const query = {};
    if (status) query.status = status;

    let getTasks = await Task.find(query);

    const sortBy = createAt ? "createAt" : updateAt ? "updateAt" : undefined;
    const sortType = createAt || updateAt;
    if (sortBy) {
      getTasks = getTasks.sort((a, b) => {
        return sortType === "asc"
          ? Date.parse(a[sortBy]) - Date.parse(b[sortBy])
          : Date.parse(b[sortBy]) - Date.parse(a[sortBy]);
      });
    }

    sendResponse(res, 200, true, { getTasks }, null, "Get tasks success");
  } catch (error) {
    next(error);
  }
};

taskController.getTaskById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(400, errors.array()[0].msg);
    }

    const task = await Task.findById(id).where("isDeleted", false);
    if (!task) throw new AppError(400, "Task ID not found");

    sendResponse(res, 200, true, { task }, null, "Get tasks success");
  } catch (error) {
    next(error);
  }
};

taskController.createTask = async (req, res, next) => {
  const { ref } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(400, errors.array()[0].msg);
    }

    const newTask = await Task.create(req.body);

    if (ref) {
      const assignedUser = await User.findById(ref).where({ isDeleted: false });
      if (!assignedUser) throw new AppError(400, "User not found");
      assignedUser.tasks.push(newTask._id);
      newTask.assignee = assignedUser;
      await assignedUser.save();
      await newTask.save();
    }

    sendResponse(res, 200, true, { newTask }, null, "Create task success");
  } catch (error) {
    next(error);
  }
};

taskController.modifyTask = async (req, res, next) => {
  const { id } = req.params;
  const { ref, status, removeAssignee } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(400, errors.array()[0].msg);
    }

    let editedTask = await Task.findById(id);

    let editUserTasks = await User.findById(ref);

    if (!editedTask) throw new AppError(400, "Task not found");

    if (editedTask.status === "done" && status && status !== "archive") {
      throw new AppError(400, "This task has done! can only change to archive");
    } else {
      editedTask.status = status;
    }

    if (ref.length > 0 && !removeAssignee) {
      if (!editUserTasks) throw new AppError(400, "Assign user not found");
      if (editUserTasks.tasks.includes(id))
        throw new AppError(400, "Task already assigned to this user");
      editUserTasks.tasks.push(id);
      editedTask.assignee = editUserTasks;
      await editUserTasks.save();
      await editedTask.save();
      sendResponse(res, 200, true, { editedTask }, null, "Create task success");
    } else if (removeAssignee) {
      editUserTasks = await User.updateOne(
        { _id: ref },
        { $pull: { tasks: id } }
      );
      sendResponse(res, 200, true, null, "Assignee removed from task");
    }
  } catch (error) {
    next(error);
  }
};

taskController.deleteTask = async (req, res, next) => {
  const { id } = req.params;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(400, errors.array()[0].msg);
    }

    let deletedTask = await Task.findById(id);

    if (!deletedTask) throw new AppError(400, "Task not found");
    if (deletedTask.isDeleted) throw new AppError(400, "Task has been deleted");

    deletedTask.isDeleted = true;

    deletedTask = await deletedTask.save();

    sendResponse(res, 200, true, { deletedTask }, null, "Get tasks success");
  } catch (error) {
    next(error);
  }
};

module.exports = taskController;
