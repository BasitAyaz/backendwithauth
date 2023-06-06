const ResponseObj = {
  status: null,
  data: null,
  message: "",
  error: "",
};
const sendResponse = (status, data, message, error) => {
  ResponseObj.status = status;
  ResponseObj.data = data;
  ResponseObj.message = message;
  ResponseObj.error = error;
  return ResponseObj;
};
module.exports = {
  sendResponse,
};
