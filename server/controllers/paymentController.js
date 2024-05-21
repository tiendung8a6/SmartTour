import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
import Users from "../models/userModel.js";
import Order from "../models/otherModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPayment = asyncHandler(async (req, res) => {
  const { email, phone } = req.body;
  const { paymentType } = req.params;

  if (!email || !phone || !paymentType) {
    throw new Error("All are required");
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
      throw new Error("Invalid payment type");
  }

  const order = await Order.create({
    orderItems,
    user: user._id,
    phone: phone,
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
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });

  res.send({ url: session.url });
});
