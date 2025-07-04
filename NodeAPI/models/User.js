const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  token: { type: String },
  firstname: { type: String, required: true },
  lastname: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  Asthma: { type: Boolean, default: false },
  COPD: { type: Boolean, default: false },
  bronchitis: { type: Boolean, default: false },
  lungCancer: { type: Boolean, default: false },
  heartDisease: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);
