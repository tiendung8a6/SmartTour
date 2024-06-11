import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
import Users from "../models/userModel.js";
import Order from "../models/orderModel.js";
import Notifications from "../models/notificationModel.js";
import crypto from "crypto";
import querystring from "qs";
import moment from "moment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const BASE_URL = process.env.BASE_URL;
const BASE_API_URL = process.env.BASE_API_URL;

export const createStripePayment = asyncHandler(async (req, res) => {
  const { email, phone } = req.body;
  const { paymentType } = req.params;

  if (!email || !phone || !paymentType) {
    throw new Error("Vui lòng nhập các trường được yêu cầu");
  }

  const user = await Users.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Email chưa được đăng kí",
    });
  }

  let orderItems;

  // Tạo đơn hàng dựa trên loại thanh toán được truyền từ req.params
  switch (paymentType) {
    case "silver":
      orderItems = [
        {
          name: "Hạng bạc",
          description: "100 điểm ",
          price: 100000,
          image: "https://pipedream.com/s.v0/app_OD5hrX/logo/orig",
        },
      ];
      break;
    case "gold":
      orderItems = [
        {
          name: "Hạng vàng",
          description: "200 điểm ",
          price: 200000,
          image: "https://pipedream.com/s.v0/app_OD5hrX/logo/orig",
        },
      ];
      break;
    case "diamond":
      orderItems = [
        {
          name: "Hạng kim cương",
          description: "350 điểm ",
          price: 300000,
          image: "https://pipedream.com/s.v0/app_OD5hrX/logo/orig",
        },
      ];
      break;
    default:
      throw new Error("Phương thức thanh toán không hợp lệ");
  }

  const order = await Order.create({
    orderItems,
    user: user._id,
    phone: phone,
    payments: "STRIPE",
  });

  await Users.findByIdAndUpdate(
    user._id,
    { $push: { orders: order._id } },
    { new: true }
  );

  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: "vnd",
        product_data: {
          name: item?.name,
          description: item?.description,
          images: [item?.image],
        },
        unit_amount: item?.price,
      },
      quantity: 1,
    };
  });

  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: {
      orderId: JSON.stringify(order?._id),
    },
    mode: "payment",
    success_url: `${BASE_URL}/success`,
    cancel_url: `${BASE_URL}/cancel`,
  });

  res.send({ url: session.url });
});

export const createVnPayPayment = asyncHandler(async (req, res) => {
  const { email, phone } = req.body;
  const { paymentType } = req.params;

  if (!email || !phone || !paymentType) {
    throw new Error("Tất cả các trường là bắt buộc");
  }

  const user = await Users.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Email chưa được đăng kí",
    });
  }

  let date = new Date();
  let createDate = moment(date).format("YYYYMMDDHHmmss");

  let ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  const tmnCode = process.env.vnp_TmnCode;
  const secretKey = process.env.vnp_HashSecret;
  const vnpUrl = process.env.vnp_Url;
  const returnUrl = `${BASE_API_URL}/payment/vnpay_return`;
  const orderId = moment(date).format("DDHHmmss");

  let bankCode = req.body.bankCode;
  let locale = req.body.language || "vn";
  const currCode = "VND";

  let amount;

  // Set amount based on paymentType
  switch (paymentType) {
    case "silver":
      amount = 100000;
      break;
    case "gold":
      amount = 200000;
      break;
    case "diamond":
      amount = 300000;
      break;
    default:
      throw new Error("Phương thức thanh toán không hợp lệ");
  }

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId, // Lưu giá trị orderId vào txnRef
    vnp_OrderInfo: `Thanh toan cho ma GD: ${orderId}`,
    vnp_OrderType: "other",
    vnp_Amount: amount * 100, // Convert to VND
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode) {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  const paymentUrl = `${vnpUrl}?${querystring.stringify(vnp_Params, {
    encode: false,
  })}`;

  // Lưu giá trị vnp_TxnRef vào CSDL Order
  const order = await Order.create({
    orderItems: [{ name: `Thanh toán cho gói: ${paymentType}`, amount }],
    user: user._id,
    email: email,
    phone: phone,
    vnp_TxnRef: orderId, // Lưu giá trị orderId vào vnp_TxnRef
    payments: "VNPAY",
  });

  await Users.findByIdAndUpdate(
    user._id,
    { $push: { orders: order._id } },
    { new: true }
  );

  res.json({ url: paymentUrl });
});

export const vnpayReturn = asyncHandler(async (req, res) => {
  const vnp_Params = req.query;

  const secureHash = vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  const sortedParams = sortObject(vnp_Params);
  const signData = querystring.stringify(sortedParams, { encode: false });
  const secretKey = process.env.vnp_HashSecret;
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    const txnRef = vnp_Params["vnp_TxnRef"];
    const rspCode = vnp_Params["vnp_ResponseCode"];

    if (rspCode === "00") {
      // Assuming the transaction reference is stored in a custom field 'txnRef' in the order model
      const order = await Order.findOne({ vnp_TxnRef: txnRef });
      if (order) {
        // Assign vnp_CardType to paymentMethod
        order.paymentMethod = vnp_Params["vnp_CardType"];

        // Assign vnp_Amount to totalPrice
        order.totalPrice = parseFloat(vnp_Params["vnp_Amount"]) / 100;

        order.paymentStatus = "paid";
        await order.save();

        // Calculate points based on totalAmount
        let points;
        const totalAmount = parseFloat(vnp_Params["vnp_Amount"]) / 100;
        switch (totalAmount) {
          case 100000: //Nhân cho 100 Vì giá tiền VNPAY
            points = 100;
            break;
          case 200000:
            points = 200;
            break;
          case 300000:
            points = 350;
            break;
          default:
            points = 0;
        }
        // Update user's points
        const updatedUser = await Users.findByIdAndUpdate(
          order.user,
          { $inc: { points: points } },
          { new: true }
        );

        if (updatedUser) {
          console.log("Điểm người dùng được cập nhật thành công");
          // Save notification
          await Notifications.create({
            user: order.user,
            pointsDeducted: points,
            reason: `Nhận thành công ${points} điểm với phương thức toán bằng VNPAY với ID: ${order.orderNumber} `,
          });
        } else {
          console.error("Không thể cập nhật điểm người dùng");
        }

        res.redirect(`${BASE_URL}/success`);
      } else {
        res.status(404).json({ message: "Không tìm thấy giao dịch" });
      }
    } else {
      res.redirect(`${BASE_URL}/cancel`);
    }
  } else {
    res.status(400).json({ message: "Chữ ký không hợp lệ" });
  }
});

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

export const getPayments = async (req, res, next) => {
  try {
    let queryResult = Order.find()
      .populate({
        path: "user",
        select: "-password",
      })
      .sort({ _id: -1 });
    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    //records count
    const totalPayments = await Order.countDocuments();

    const numOfPage = Math.ceil(totalPayments / limit);

    queryResult = queryResult.skip(skip).limit(limit);

    const payments = await queryResult;

    res.status(200).json({
      success: true,
      message: "Dữ liệu thanh toán được tải thành công",
      totalPayments: totalPayments,
      data: payments,
      page,
      numOfPage,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
