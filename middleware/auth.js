const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // get the tokken from the hedder
  const token = req.header("x-auth-token");

  // cheak if not token
  if (!token) {
    return res.status(401).json({ msg: "no token,authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, config.get("jwtSercet"));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "token not vaild" });
  }
};
