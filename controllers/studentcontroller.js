const { sendResponse } = require("../helper/helper");
const studentModel = require("../models/studentModel");

const StudentController = {
  getStudents: async (req, res) => {
    try {
      const result = await studentModel.find();
      if (!result) {
        res.send(sendResponse(false, null, "No Data Found")).status(404);
      } else {
        res.send(sendResponse(true, result)).status(200);
      }
    } catch (e) {
      console.log(e);
      res.send(sendResponse(false, null, "Internal Server Error")).status(400);
    }
  },
  searchStudent: async (req, res) => {
    let { firstName, LastName } = req.body;
    if (firstName) {
      let result = await studentModel.find({
        firstName: firstName,
        LastName: LastName,
      });
      if (!result) {
        res.send(sendResponse(false, null, "No Data Found")).status(404);
      } else {
        res.send(sendResponse(true, result)).status(200);
      }
    }
  },
  searchWithPagination: async (req, res) => {
    try {
      let { pageNo, pageSize, searchEntity, searchVal } = req.body;

      let result = await studentModel
        .find({ [searchEntity]: searchVal })
        .skip((pageNo - 1) * pageSize)
        .limit(pageSize);
      if (result) {
        let count = await studentModel.countDocuments();
        req.headers.recCount = count;
        res.send({ ...sendResponse(true, result), count: count });
      } else {
        res.send(sendResponse(false, null, "No Data Found"));
      }
    } catch (e) {}
  },
};

module.exports = StudentController;
