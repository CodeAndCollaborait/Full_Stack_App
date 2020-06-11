const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (request, response, next) {
  //Read token from heder
  const token = request.header("x-auth-token");

  //if no token
  if (!token) {
    return response
      .status(401)
      .json({ message: "No Token, Authorization denied" });
  }

  //verify the token
  try {
    // jwt.verify will verify the token with secret"
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    request.user = decoded.user;
    next();
  } catch (error) {
    response.status(401).json({ message: "Token is not valid" });
  }
};
