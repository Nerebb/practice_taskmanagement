const mongoose = require("mongoose");
//Create schema
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
    },
    tasks: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Task" }],
    isDeleted: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const usersField = Object.keys(userSchema.obj);
//Create and export model

const User = mongoose.model("User", userSchema);
module.exports = { User, usersField };
