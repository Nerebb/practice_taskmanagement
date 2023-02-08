const { validationResult } = require("express-validator");
const { isValidObjectId } = require("mongoose");
const { sendResponse, AppError } = require("../helpers/utils");
const { Task } = require("../models/Task");
const { User } = require("../models/User");

const taskController = {};

taskController.getTask = async (req, res, next) => {
  const { status, name } = req.query;
  const { sortBy } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(400, errors.array()[0].msg);
    }

    //Combine the query for mongoose
    const query = {};
    if (name) query.name = name;
    if (status) query.status = status;

    let getTasks;
    //Sort
    if (sortBy) {
      getTasks = await Task.find(query).sort(sortBy);
      if (getTasks.length === 0) throw new AppError(400, "Task not found");
    } else {
      getTasks = await Task.find(query);
      if (getTasks.length === 0) throw new AppError(400, "Task name not found");
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

    const task = await Task.findById(id).where({ isDeleted: false });
    if (!task)
      throw new AppError(400, "Task ID not found or Task has been deleted");

    sendResponse(res, 200, true, { task }, null, "Get tasks success");
  } catch (error) {
    next(error);
  }
};

taskController.createTask = async (req, res, next) => {
  const { assigneeId } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(400, errors.array()[0].msg);
    }

    const newTask = await Task.create(req.body);

    /**
     * @assignee
     * @allowedFilter : 'admin','employee'
     * @description: user roles
     * @required: Only admin can set the role
     */
    if (assigneeId) {
      const assignedUser = await User.findById(assigneeId).where({
        isDeleted: false,
      });
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
  const { name, description, assigneeId, status, removeAssignee } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(400, errors.array()[0].msg);
    }

    //Checks removeAssignee type :boolean
    if (removeAssignee && typeof removeAssignee !== "boolean")
      throw new AppError(400, "removeAssignee is a boolean type");

    let editedTask = await Task.findById(id);

    /**
     * @Status
     * @description: status = "done" then can only change to archive
     */
    if (editedTask.status === "done" && status && status !== "archive") {
      throw new AppError(400, "This task has done! can only change to archive");
    } else {
      editedTask.status = status;
    }

    /**
     * @assigneeId
     * @description: a reference to User, key: ObjectId of User
     */

    if (assigneeId) {
      //Check assignee is ObjectId
      if (!isValidObjectId(assigneeId)) throw new AppError(400, "UserId or ");

      //FetchData
      let assignUser = await User.findById(assigneeId).where({
        isDeleted: false,
      });

      //Check if can find editUser
      if (!assignUser)
        throw new AppError(400, "Assign user not found or has been deleted");

      if (!removeAssignee) {
        //Check if request Assignee already assign the task
        if (assignUser.tasks.some((i) => i.toString() === id))
          throw new AppError(400, "User already assigned to this task");

        //Update
        assignUser.tasks.push(id);
        editedTask.assignee = assignUser;

        await assignUser.save();
      } else if (removeAssignee) {
        //Check if assigneeId is assigned
        if (!assignUser.tasks.some((i) => i.toString() === id))
          throw new AppError(400, "User given not found in selected task");

        await User.updateOne({ _id: assigneeId }, { $pull: { tasks: id } });

        editedTask = await Task.updateOne(
          { _id: id },
          { $unset: { assignee: assigneeId } }
        );

        return sendResponse(res, 200, true, "Assignee removed from task", null);
      }
    }

    /**
     * @AllowedField : name, description
     */
    if (name) editedTask.name = name;
    if (description) editedTask.description = description;
    await editedTask.save();

    sendResponse(res, 200, true, editedTask, null);
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

    sendResponse(res, 200, true, null, null, "Delete tasks success");
  } catch (error) {
    next(error);
  }
};

module.exports = taskController;
