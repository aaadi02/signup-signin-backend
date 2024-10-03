const userModel = require("../model/userSchema");
const emailValidator = require('email-validator');

const signup = async(req, res, next) => {
  const {name, email, password, confirmPassword} = req.body;
  console.log(name, email, password, confirmPassword);

  if(!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Every field is mandatory !'
    })
  }

  const validEmail = emailValidator.valid(email);
  if(!validEmail) {
    return res.status(400).json({
      success: false,
      message: 'please enter valid email id !'
    })
  }

  try {
    const userInfo = userModel(req.body);
    const result = await userInfo.save();

    return res.status(200).json({
      sucess: true,
      data: result
  })
  }catch(e) {
    if(e.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'account already exists with provided email id'
      })
    }
    return res.status(400).json({
      success: false,
      message: e.message
    })
  }
};

module.exports = {signup};

