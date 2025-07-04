const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register a new user
exports.register = async (req, res) => {
  const {
    username,
    email,
    password,
    Asthma,
    COPD,
    bronchitis,
    lungCancer,
    heartDisease,
    firstname,
    lastname,
    token,
  } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      token,
      email,
      password: hashedPassword,
      Asthma,
      COPD,
      bronchitis,
      lungCancer,
      heartDisease,
      firstname,
      lastname,
    });
    await newUser.save();
    console.log("regsitered use: ", newUser);

    res.status(201).send(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Authenticate user and return JWT
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      console.log("token and user:", { token: token, user: user });

      res.json({ token: token, user: user });
    } else {
      res.status(400).send("Invalid credentials");
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: error.message });
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  const { username, email } = req.body;
  try {
    await User.findByIdAndUpdate(req.params.id, { username, email });
    res.send("User updated");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change user password
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (user && (await bcrypt.compare(oldPassword, user.password))) {
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      await user.save();
      res.send("Password changed");
    } else {
      res.status(400).send("Old password is incorrect");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
