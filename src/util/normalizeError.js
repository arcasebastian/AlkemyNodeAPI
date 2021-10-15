const { validationResult } = require("express-validator");

function normalizeError(message, errorCode, extraData = "") {
  const error = new Error(message);
  error.statusCode = errorCode;
  error.extraData = extraData;
  return error;
}
function checkValidationErrors(req) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return false;
  let firstError = errors.array({ onlyFirstError: true })[0];
  let errorCode = 400;
  if (firstError.msg.includes("already")) errorCode = 409;
  if (firstError.msg.includes("Not Found")) errorCode = 404;
  return normalizeError(firstError.msg, errorCode);
}

exports.normalizeError = normalizeError;
exports.checkValidationErrors = checkValidationErrors;
