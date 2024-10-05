const UserModel = require("./../schemas/user.schema");
const CodeVerificationModel = require("./../modules/auth/auth.schema");
const jwt = require("jsonwebtoken");

const verifyCode = (email, code, type) => {
  return new Promise(async (resolve, reject) => {
    const check_code = await CodeVerificationModel.findOne({
      email,
      code,
      type,
    });

    // code not found
    if (!check_code) {
      return reject({
        message: "Invalid code",
      });
    }

    // code is used
    if (check_code.is_used) {
      return reject({
        message: "Code expired",
      });
    }

    check_code.is_used = true;

    await CodeVerificationModel.findByIdAndUpdate(check_code._id, check_code);

    // find user
    const user = await UserModel.findOne({ _id: check_code.user_id });
    // user not found
    if (!user) {
      return reject({
        message: "Auth failed, Invalid username/password",
      });
    }

    // token generation
    const currentDate = new Date();
    const tokenObject = {
      user_id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      iat: currentDate.getTime(),
    };

    const jwtToken = jwt.sign(tokenObject, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

    return resolve({
      token: jwtToken,
      user: tokenObject,
    });
  });
};

module.exports = verifyCode;
