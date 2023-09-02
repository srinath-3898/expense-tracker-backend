const Payment = require("../models/paymentModel");
const Razorpay = require("razorpay");
const User = require("../models/userModel");

const createOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const orderExists = await Payment.findOne({ where: { orderId } });
    if (orderExists) {
      return res
        .status(409)
        .json({ status: false, data: null, message: "Order already created" });
    }
    const instance = new Razorpay({
      key_id: "rzp_test_HOTPHJrQjTkXoL",
      key_secret: "N6XLAdiAgOCkbaZsKkdq3cGr",
    });
    instance.orders.create(
      { amount: 10000, currency: "INR" },
      async (error, response) => {
        if (error) {
          return res
            .status(500)
            .json({ status: false, data: null, message: error.message });
        }
        const { id, amount, currency } = response;
        const payment = await req.user.createPayment({
          orderId: orderId,
          rpOrderId: id,
          amount: amount,
          currency: currency,
          status: "PENDING",
        });
        if (!payment) {
          throw new Error(
            "Something went wrong while creating payment, please try again"
          );
        }
        return res.status(201).json({
          status: true,
          data: payment,
          message:
            "Your order has been created successfully, redirecting to payments screen...",
        });
      }
    );
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, data: null, message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { rpOrderId, status } = req.body;
    if (!rpOrderId || !status) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "Missing required fields",
      });
    }
    const payment = await Payment.findOne({ where: { rpOrderId } });
    if (!payment) {
      return res
        .status(400)
        .json({ status: false, data: null, message: "Order not found" });
    }
    const updates = await Promise.all([
      payment.update({ status }),
      req.user.update({ premiumUser: status === "SUCCESS" ? true : false }),
    ]);
    if (!updates) {
      throw new Error("Something went wrong while updating payment status");
    }
    return res.status(201).json({ status: true, data: updates });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, data: null, message: error.message });
  }
};

module.exports = { createOrder, updateStatus };
