import mongoose from "mongoose";
import Trips from "../models/tripModel.js";
import Plans from "../models/planModel.js";

export const createPlan = async (req, res, next) => {
  try {
    const { planName, startDate, startTime, endDate, endTime, address, info } =
      req.body;
    const { id } = req.params;

    const plan = await Plans.create({
      planName,
      startDate,
      startTime,
      endDate,
      endTime,
      address,
      info,
    });

    const trip = await Trips.findById(id);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    trip.plans.push(plan._id);
    await trip.save();

    res.status(201).json({
      success: true,
      message: "Plan created successfully and added to trip",
      data: plan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
