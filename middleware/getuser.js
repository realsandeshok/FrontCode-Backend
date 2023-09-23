const jwt = require("jsonwebtoken");
const JWT_SECRET = "Mynameis$andesh:)";

const getuser = (req, res, next) => {
  // Get user from jwt token and add it to req obj.
  const token = req.header("authentication-token");
  if (!token) {
    res.status(401).send({ error: "Invalid user" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Invalid user" });
  }
};

module.exports = getuser;
