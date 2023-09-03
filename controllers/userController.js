const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../configs/databaseConfig");
const SibApiV3Sdk = require("sib-api-v3-sdk");

const genereteToken = ({ id, fullName, email, phone }) => {
  return jwt.sign({ id, fullName, email, phone }, "UYGR$#%^&*UIHGHGCDXRSW", {
    expiresIn: "30d",
  });
};

const signup = async (req, res) => {
  const transaction = await sequelize.transaction();
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
    const user = await User.create(
      {
        fullName,
        email,
        mobile,
        password: hashedPassword,
        premiumUser: false,
        totalExpenses: 0,
      },
      { transaction }
    );
    if (!user) {
      await transaction.rollback();
      throw new Error(
        "Some thing went wrong while signing up, please try again"
      );
    }
    await transaction.commit();
    return res.status(201).json({
      status: true,
      data: user,
      message: "Signedup successfully, please signin to continue...",
    });
  } catch (error) {
    await transaction.rollback();
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

const forgotPassword = async (req, res) => {
  try {
    const { forgotPasswordEmail } = req.body;
    if (!forgotPasswordEmail) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "Missing email",
      });
    }
    const user = await User.findOne({ where: { email: forgotPasswordEmail } });
    if (!user) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "Please enter registered email id",
      });
    }
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey =
      "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";
    const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();
    const sender = {
      email: "munnuru.srinath3898@gmail.com",
      name: "Munnuru Srinath",
    };
    const recievers = [{ email: forgotPasswordEmail }];
    await tranEmailApi.sendTransacEmail({
      sender,
      to: recievers,
      subject: "Reset Password",
      htmlContent: `<p>Hello ${forgotPasswordEmail}</p>`,
    });
    return res.status(201).json({
      status: true,
      data: null,
      message:
        "An email has been sent to your registered mail id with the reset password link",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, data: null, message: error.message });
  }
};

module.exports = { signup, signin, profile, forgotPassword };
