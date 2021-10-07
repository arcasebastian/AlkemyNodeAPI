function normalizeError(message, errorCode, extraData = "") {
  const error = new Error(message);
  error.statusCode = errorCode;
  error.extraData = extraData;
  return error;
}

exports.normalizeError = normalizeError;
