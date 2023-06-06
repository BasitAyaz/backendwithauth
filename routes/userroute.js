const express = require("express");
const route = express.Router();
const { sendResponse } = require("../helper/helper");
const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const AuthController = require("../controllers/authController");

route.post("/signup", async (req, res) => {
  const { userName, email, password } = req.body;
  const obj = { userName, email, password };
  let requiredArr = ["userName", "email", "password"];
  let errArr = [];

  requiredArr.forEach((x) => {
    if (!obj[x]) {
      errArr.push(x);
    }
  });

  if (errArr.length > 0) {
    res
      .send(sendResponse(false, null, "Some Fileds are Missing", errArr))
      .status(400);
    return;
  } else {
    let hashPassword = await bcrypt.hash(obj.password, 10);
    obj.password = hashPassword;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res
        .send(sendResponse(false, null, "This Email is Already Exist"))
        .status(403);
    } else {
      UserModel.create(obj)
        .then((result) => {
          res.send(sendResponse(true, result, "User Saved Successfully"));
        })
        .catch((err) => {
          res
            .send(sendResponse(false, err, "Internal Server Error"))
            .status(400);
        });
    }
  }
});
route.post("/login", AuthController.login);
route.post("/");
route.get("/", AuthController.getUsers);
route.get("/test", AuthController.protected, (req, res) => {
  res.send("/User Valid");
});
route.put("/");
route.delete("/");

module.exports = route;
