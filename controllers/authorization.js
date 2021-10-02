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
    res.status(201).json({ access_token: "test_token" });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

function setError(message, errorData) {
  const error = new Error(message);
  error.statusCode = errorData;
  return error;
}
