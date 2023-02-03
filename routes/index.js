var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).send("Welcome taskmanagement API");
});

const usersRouter = require("./users.api.js");
router.use("/users", usersRouter);

const tasksRouter = require("./tasks.api.js");
router.use("/tasks", tasksRouter);
module.exports = router;
