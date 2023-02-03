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

/* GET users listing. */
router.get("/", checkSchema(getTaskValidate), getTask);

router.get("/:id", checkSchema(validator.id), getTaskById);

router.post("/create", checkSchema(createTaskValidate), createTask);

router.put("/:id", checkSchema(modifyTaskValidate), modifyTask);

router.delete("/:id", checkSchema(deleteTaskValidate), deleteTask);

module.exports = router;
