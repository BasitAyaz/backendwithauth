const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const { sendResponse } = require("../helper/helper");
const jwt = require("jsonwebtoken");

const AuthController = {
  login: async (req, res) => {
    const { email, password } = req.body;
    const obj = { email, password };
    console.log(obj);
    let result = await userModel.findOne({ email });
    if (result) {
      let isConfirm = await bcrypt.compare(obj.password, result.password);
      if (isConfirm) {
        let token = jwt.sign({ ...result }, process.env.SECURE_KEY, {
          expiresIn: "24h",
        });
        res.send(
          sendResponse(true, { user: result, token }, "Login Successfully")
        );
      } else {
        res.send(sendResponse(false, null, "Credential Error"));
      }
    } else {
      res.send(sendResponse(false, err, "User Doesn't Exist"));
    }
  },
  getUsers: async (req, res) => {
    userModel
      .find()
      .then((result) => {
        res.send(sendResponse(true, result));
      })
      .catch((err) => {});
  },
  protected: async (req, res, next) => {
    let token = req.headers.authorization;
    if (token) {
      token = token.split(" ")[1];
      jwt.verify(token, process.env.SECURE_KEY, (err, decoded) => {
        if (err) {
          res.send(sendResponse(false, null, "Unauthorized")).status(403);
        } else {
          console.log(decoded);
          next();
        }
      });
    } else {
      res.send(sendResponse(false, null, "Unauthorized")).status(403);
    }
  },
  adminProtected: async (req, res, next) => {
    let token = req.headers.authorization;
    token = token.split(" ")[1];
    jwt.verify(token, process.env.SECURE_KEY, (err, decoded) => {
      if (err) {
        res.send(sendResponse(false, null, "Unauthorized")).status(403);
      } else {
        if (decoded._doc.isAdmin) {
          next();
        } else {
          res
            .send(sendResponse(false, null, "You Have Rights for this Action"))
            .status(403);
        }
      }
    });
  },
};
module.exports = AuthController;
