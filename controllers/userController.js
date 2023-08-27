const User = require("../models/userModel");

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
        .status(400)
        .json({ status: false, data: null, message: "Account already exists" });
    }
    const user = await User.create({ fullName, email, mobile, password });
    if (!user) {
      throw new Error(
        "Some thing went wrong while signing up, please try again"
      );
    }
    return res
      .status(201)
      .json({ status: true, data: user, message: "Signedup successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, data: null, message: error.message });
  }
};

module.exports = { signup };
