const jwt = require("jsonwebtoken");
const UserModel = require("./../schemas/user.schema");

const auth = async (req, res, next) => {
  if (!req.headers["authorization"]) {
    return res.status(403).json({ status: "error", message: "Unauthorized" });
  }
  try {
    const token = req.headers["authorization"].replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.user = decoded;
    const user = await UserModel.findById(decoded.user_id);
    return user
      ? next()
      : res.status(403).json({ status: "error", message: "Unauthorized" });
  } catch (err) {
    return res.status(403).json({ status: "error", message: "Unauthorized" });
  }
};

module.exports = auth;
