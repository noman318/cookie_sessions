const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  naame: {
    type: String,
    required: true,
  },
  uname: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("user", userSchema);
