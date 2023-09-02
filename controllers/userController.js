const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const genereteToken = ({ id, fullName, email, phone }) => {
  return jwt.sign({ id, fullName, email, phone }, "UYGR$#%^&*UIHGHGCDXRSW", {
    expiresIn: "30d",
  });
};

const signup = async (req, res) => {
  try {
    const { fullName, email, mobile, password } = req.body;
    if (!fullName || !email || !mobile || !password) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "Missing required fields",
      });
    }
    const userExits = await User.findOne({ where: { email } });
    if (userExits) {
      return res
        .status(403)
        .json({ status: false, data: null, message: "Account already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      fullName,
      email,
      mobile,
      password: hashedPassword,
      premiumUser: false,
      totalExpenses: 0,
    });
    if (!user) {
      throw new Error(
        "Some thing went wrong while signing up, please try again"
      );
    }
    return res.status(201).json({
      status: true,
      data: user,
      message: "Signedup successfully, please signin to continue...",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, data: null, message: error.message });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "Email or password missing",
      });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ status: false, data: null, message: "User not found" });
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (user && !comparePassword) {
      return res
        .status(403)
        .json({ status: false, data: null, message: "Invalid credentials" });
    }
    const token = genereteToken(user);
    return res.status(201).json({
      status: true,
      data: { token, user },
      message: "Logged in successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, data: null, message: error.message });
  }
};

const profile = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ status: true, data: req.user, message: "User profile" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, data: null, message: error.message });
  }
};

module.exports = { signup, signin, profile };
