const express = require("express");
const userRouter = express.Router();
const userController = require('../handler/user');

userRouter.get("/", userController.getAllUsers);

userRouter.get("/:id", userController.getUserById);

userRouter.post("/", userController.createUser);

userRouter.put("/:id", userController.updateUser);

userRouter.delete("/:id", userController.deleteUser);

module.exports = userRouter;