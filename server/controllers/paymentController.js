import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
import Users from "../models/userModel.js";
import Order from "../models/otherModel.js";

const stripe = new Stripe(process.env.STRIPE_KEY);

export const createPayment = asyncHandler(async (req, res) => {
  const { orderItems, email } = req.body;

  if (!orderItems || orderItems.length <= 0) {
    throw new Error("No Order Items");
  }

  if (!email) {
    throw new Error("Email is required");
  }

  const user = await Users.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const order = await Order.create({
    orderItems,
    user: user._id,
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
      orderId: order._id.toString(),
    },
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });

  res.send({ url: session.url });
});
