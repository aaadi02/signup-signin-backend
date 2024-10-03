const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'user name is required'],
    minLength: [5, 'name must be greater than 5 characters'],
    maxLength: [20, 'name must be less than 20 characters'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: [true, "entered email is already registered"],
    lowercase: true,
  },
  password: {
    type: String,
    select: false,
  },
  forgotPasswordToken: {
    type: String,
  },
  forgotPasswordExpiryDate: {
    type: Date,
  },
}, {
  timestamps: true,
})

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;