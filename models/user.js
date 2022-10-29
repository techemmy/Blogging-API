const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: string,
    required: [true, "Email is required!"],
    unique: [true, "Email already exists!"],
  },
  firstName: {
    type: string,
    require: [true, "Your first name is required!"],
  },
  lastName: {
    type: string,
    require: [true, "Your last name is required!"],
  },
  password: {
    type: string,
    required: [true, "Password is required!"]
  }
});

module.exports = mongoose.model("User", UserSchema);