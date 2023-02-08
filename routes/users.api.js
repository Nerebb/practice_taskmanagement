var express = require("express");
const { checkSchema } = require("express-validator");
const {
  createUser,
  modifyUser,
  deleteUser,
  getUser,
  getUserById,
} = require("../controllers/users.controller");
const validator = require("../validator");
const {
  CreateUserValidate,
  ModifyUserValidate,
  DeleteUserValidate,
  GetUserValidate,
  GetUserByIdValidate,
} = require("../validator/userValidate");
var router = express.Router();

//Get
/**
 * @route API/users
 * @description : get users
 * @query : {
 *            "name": string, filter by user name
 *            "role": string, filter by user role
 *          }
 */
router.get("/", checkSchema(GetUserValidate), getUser);

//Get
/**
 * @route API/users
 * @description : get user by ID
 * @query : {getAllTasks: Boolean, get current user Tasks}
 */
router.get("/:id", checkSchema(GetUserByIdValidate), getUserById);

//Create
/**
 * @route API/users
 * @description : create User
 * @allowedField : 'name': string - username
 */
router.post("/signup", checkSchema(CreateUserValidate), createUser);

//Update
/**
 * @route API/users/:id
 * @description : update a task by id
 * @allowedFied : 'name': string , 'role': 'employee' - Only admin can set this
 * @body : "curId": ObjectId - current login ID
 */
router.put("/:id", checkSchema(ModifyUserValidate), modifyUser);

//Detele
/**
 * @route API/users/:id
 * @description : Soft delete selected user by id, $set: isDeleted:true
 * @body : "curId": ObjectId - current login ID
 */
router.delete("/:id", checkSchema(DeleteUserValidate), deleteUser);

module.exports = router;
