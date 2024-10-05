const CodeVerificationModel = require("./auth.schema");
const UserModel = require("./../../schemas/user.schema");
const { hashPassword, comparePassword } = require("../../helpers/bcrypt");
const verifyCode = require("./../../helpers/verifyCode");
const generateOTP = require("./../../helpers/generateOTP");
const EmailConfig = require("./../../helpers/email");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const userModel = new UserModel(req.body);
  userModel.password = await hashPassword(req.body.password);
  try {
    const user = await userModel.save();
    user.password = undefined;

    // send verification code

    const codeVerificationRequest = new CodeVerificationModel({
      email: user.email,
      type: "register",
      code: generateOTP(6),
      user_id: user._id,
      is_used: false,
    });

    const codeVerificationResult = await codeVerificationRequest.save();

    if (!codeVerificationResult) {
      return res.status(400).json({
        status: "error",
        message: "Unable to send verification code",
      });
    }
    //TODO: update message
    return res.status(200).json({
      status: "success",
      message: "Verification code sent success",
    });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ status: "error", message: "Email already exists" });
    }
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((error) => {
        return {
          field: error["properties"].path,
          message: error["properties"].message,
        };
      });
      return res.status(400).json(errors);
    }
    return res.status(500).json({
      status: "error",
      message: "An error occurred during login",
    });
  }
};

const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    // user not found
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Auth failed, Invalid username/password",
      });
    }
    // password required
    if (!req.body.password) {
      return res.status(400).json({
        status: "error",
        message: "Auth failed, Invalid username/password",
      });
    }

    const isValidPassword = await comparePassword(
      req.body.password,
      user.password
    );
    // invalid password
    if (!isValidPassword) {
      return res.status(401).json({
        status: "error",
        message: "Auth failed, Invalid username/password",
      });
    }

    // send verification code

    const codeVerificationRequest = new CodeVerificationModel({
      email: user.email,
      type: "login",
      code: generateOTP(6),
      user_id: user._id,
      is_used: false,
    });

    const codeVerificationResult = await codeVerificationRequest.save();

    if (!codeVerificationResult) {
      return res.status(400).json({
        status: "error",
        message: "Unable to send verification code",
      });
    }

    const mail = {
      to: user.email,
      subject: "Sign in Verification Code",
      html: `
      <p style="font-weight: 400;font-size:24px;">Please use this code to proceed with sign in</p>
      <h1 style="font-weight: 700;letter-spacing: 1rem;"> ${codeVerificationResult.code}</h1>
      `,
    };

    const sendMail = await EmailConfig.sendEmail(mail);

    if (!sendMail) {
      return res.status(400).json({
        status: "error",
        message: "Unable to send verification code",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Verification code sent",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred during login",
    });
  }
};

const validateCode = async (req, res) => {
  try {
    console.log(req.body);
    const result = await verifyCode(
      req.body.email,
      req.body.code,
      req.body.type
    );
    if (!result) {
      return res.status(400).json({
        status: "error",
        message: "Invalid code",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Logged in successfully",
      data: result,
    });
  } catch (err) {
    if (err.message) {
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    } else
      return res.status(500).json({
        status: "error",
        message: "An error occurred during registration",
      });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    // user not found
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User with that email does not exist",
      });
    }

    // Generate a reset token (JWT or crypto)
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Sending email with reset link
    const resetURL = `http://localhost:4100/reset-password?token=${resetToken}`;
    const mail = {
      to: user.email,
      subject: "Password Reset",
      html: `<p>You requested a password reset. Please click this link to reset your password: </p> <a href="${resetURL}" target="_blank"> CLICK HERE</a>`,
    };

    const sendEmail = await EmailConfig.sendEmail(mail);
    return !sendEmail
      ? res
          .status(500)
          .json({ message: "Error sending email", status: "error" })
      : res.status(200).json({
          status: "success",
          message: "Reset link sent to your email",
        });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "error", message: "Error processing request" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    user.password = await hashPassword(newPassword);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password has been successfully reset",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating password", error: error.message });
  }
};

const changePassword = async (req, res) => {
  const logged_in_user = res.locals.user;
  const { currentPassword, newPassword } = req.body;

  try {
    // Finding the user by email
    const user = await UserModel.findById(logged_in_user.user_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //  Verifying the current password
    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hashing and Updating the user's password and saving it
    user.password = await hashPassword(newPassword);
    await user.save();

    res
      .status(200)
      .json({ status: "success", message: "Password updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating password", error: error.message });
  }
};

module.exports = {
  register,
  login,
  validateCode,
  forgotPassword,
  resetPassword,
  changePassword,
};
