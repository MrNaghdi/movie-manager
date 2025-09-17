const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

//User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter user name's."],
  },
  email: {
    type: String,
    required: [true, "Please enter user email's."],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email."],
  },
  password: {
    type: String,
    required: [true, "Please enter password."],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please enter confirm password."],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
});


//Hash User Password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});


//Check user password and login password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
