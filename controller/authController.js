const userModel = require("../model/userSchema");
const emailValidator = require("email-validator");

const signup = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  console.log(name, email, password, confirmPassword);

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Every field is mandatory !",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "password and confirm password doesn't match",
    });
  }

  const validEmail = emailValidator.valid(email);
  if (!validEmail) {
    return res.status(400).json({
      success: false,
      message: "please enter valid email id !",
    });
  }

  try {
    const userInfo = userModel(req.body);
    const result = await userInfo.save();

    return res.status(200).json({
      sucess: true,
      data: result,
    });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "account already exists with provided email id",
      });
    }
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "every field is mandatory !",
    });
  }

  try {
    const user = await userModel
      .findOne({
        email,
      })
      .select("+password");

    if (!user || user.password === password) {
      return res.status(400).json({
        success: false,
        message: "invalid credentials !",
      });
    }

    const token = user.jwToken();
    user.password = undefined;

    const cookieOption = {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    };

    res.cookie("token", token, cookieOption);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (e) {
    res.status(200).json({
      success: true,
      message: e.message,
    });
  }
};

module.exports = { signup, signin };
