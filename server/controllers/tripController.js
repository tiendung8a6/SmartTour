import mongoose from "mongoose";
import Trips from "../models/tripModel.js";
import Plans from "../models/planModel.js";

export const createTrip = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { tripName, city, startDate, endDate, image, plans } = req.body;

    if (!(tripName && city && startDate && endDate && image && plans)) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required. Please enter tripName, city, startDate, endDate, image, and plans.",
      });
    }

    // Kiểm tra xem plans có tồn tại không
    const plan = await Plans.findById(plans);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    // Tạo trip mới
    const trip = await Trips.create({
      user: userId,
      tripName,
      city,
      startDate,
      endDate,
      image,
      plans: plan._id, // Gán ID của plan đã tìm thấy
    });

    res.status(200).json({
      success: true,
      message: "Trip created successfully",
      data: trip,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
