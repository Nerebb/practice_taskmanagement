var express = require("express");
const { checkSchema, check, param, body } = require("express-validator");
const {
  createTask,
  modifyTask,
  getTask,
  deleteTask,
  getTaskById,
} = require("../controllers/tasks.controller");
const { sendResponse } = require("../helpers/utils");
const Task = require("../models/User");
const validator = require("../validator");
const {
  createTaskValidate,
  modifyTaskValidate,
  getTaskValidate,
  deleteTaskValidate,
} = require("../validator/taskValidate");
const AdminID = process.env.ADMIN_ID;
var router = express.Router();

//READ
/**
 * @route GET API/tasks
 * @description Get a list of tasks
 * @access public
 * @query : {
 *            "status":["pending", "working", "review", "done", "archive"],
 *          }
 * @body : sortBy: {<field>: -1 or 1}, 1 for ascending, -1 for descending
 *
 */
router.get("/", checkSchema(getTaskValidate), getTask);

//Read
/**
 * @route GET API/tasks/:id
 * @descripttion Get task by task ID
 * @access admin, public
 */
router.get("/:id", checkSchema(validator.id), getTaskById);

//Create
/**
 * @route Create API/tasks/:id
 * @description Create a task
 * @body :
 *          {
              "name": string,
              "description": string,
              "status": ["pending", "working", "review", "done", "archive"],
              "assigneeId": objectId string to assign user to task - require: role Admin
              "curId": current user ID
            }
 */
router.post("/create", checkSchema(createTaskValidate), createTask);

//Update
/**
 * @route PUT API/tasks/:id
 * @description Update a task
 * @body :
 *         {
              "name": string,
              "description": string,
              "status": ["pending", "working", "review", "done", "archive"]
              "assigneeId": objectId string to assign user to task - require: role Admin
              "curId": current user ID
              "removeAssignee": Boolean - remove task assignee
           }
 */
router.put("/:id", checkSchema(modifyTaskValidate), modifyTask);

//Delete
/**
 * @roue DELETE API/tasks/:id
 * @description soft delete a task by id, $set isDelete: true
 */
router.delete("/:id", checkSchema(deleteTaskValidate), deleteTask);

module.exports = router;
