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
} = require("../validator/userValidate");
var router = express.Router();

router.get("/", checkSchema(GetUserValidate), getUser);

router.get("/:id", checkSchema(validator.id), getUserById);

router.post("/signup", checkSchema(CreateUserValidate), createUser);

router.put("/:id", checkSchema(ModifyUserValidate), modifyUser);

router.delete("/:id", checkSchema(DeleteUserValidate), deleteUser);

module.exports = router;
