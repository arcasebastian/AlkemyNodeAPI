exports.register = (req, res, next) => {
  try {
    if (req.body === {}) {
      throw setError("bad request", 400);
    }
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw setError("name, email and password are required", 400);
    }
    if (!email.includes("@")) {
      throw setError("email is invalid", 400);
    }
    if (!password.length > 8) {
      throw setError("password must be at least 8 characters", 400);
    }
    res.status(201).json({ status: "User registered successfully" });
  } catch (err) {
    const httpCode = err.statusCode || 500
    res.status(httpCode).json({ error: err.message, httpCode: httpCode });
  }
};

exports.login = (req, res, next) => {
  try {
    let isInvalid = false;
    if (req.body === {}) {
      isInvalid = true;
    }
    const { email, password } = req.body;
    if ( !email || !password) {
      isInvalid = true;
    }
    if (!email.includes("@")) {
      isInvalid = true;
    }
    if (isInvalid)
      throw setError("Invalid email or password", 401);
    res.status(200).json({ access_token: '' });
  } catch (err) {
    const httpCode = err.statusCode || 500
    res.status(httpCode).json({ error: err.message, httpCode: httpCode, extraData: err.extraData });
  }
};


function setError(message, errorCode, extraData = '') {
  const error = new Error(message);
  error.statusCode = errorCode;
  error.extraData = extraData;
  return error;
}
