import mongoose from "mongoose";
import Trips from "../models/tripModel.js";
import Plans from "../models/planModel.js";

export const createPlan = async (req, res, next) => {
  try {
    const { planName, startDate, startTime, endDate, endTime, address, info } =
      req.body;

    if (
      !planName ||
      !startDate ||
      !startTime ||
      !endDate ||
      !endTime ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message:
          "planName, startDate, startTime, endDate, endTime, and address are required fields.",
      });
    }

    // Tạo plan mới
    const plan = await Plans.create({
      planName,
      startDate,
      startTime,
      endDate,
      endTime,
      address,
      info,
    });

    // Trả về kết quả thành công
    res.status(201).json({
      success: true,
      message: "Plan created successfully",
      data: plan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
