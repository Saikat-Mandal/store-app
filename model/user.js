const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { token } = require("morgan");
// schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    maxLength: [40, "name should be under 40 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    validate: [validator.isEmail, "please enter email in correct format"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: [6, "password should be atleast 6 characters long"],
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },

  photo: {
    id: {
      type: String,
      required: true,
    },
    secured: {
      type: String,
      required: true,
    },
  },
  resetPasswordToken: String,
  resetPasswordExpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// exncryprion for password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// validate user send password and this password
userSchema.methods.isValidPassword = async function (usersendPassword) {
  return await bcrypt.compare(usersendPassword, this.password);
};

// create and jwt token
userSchema.method.getJetToken = function () {
  return jwt.sign({ id: this_id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

//generate forgot password token
userSchema.methods.getForgotPasswordToken = function () {
  // generate long random string
  const forgotToken = crypto.randomBytes(20).toString("hex");

  // getting a hash and make sure to hash on backend
  this.getForgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");

  // time of token
  this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

  return forgotToken;
};

module.exports = mongoose.model("User", userSchema);
