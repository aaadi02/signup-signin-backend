const mongoose = require('mongoose');
const {Schema} = mongoose;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

userSchema.pre('save', async function () {
  if(!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  return next();
})

userSchema.methods = {
  jwtToken () {
    return jwt.sign(
      {id: this._id, email: this.email},
      process.env.SECRET,
      {expiresIn: '24h'}
    )
  }
}

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;