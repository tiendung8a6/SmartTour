import mongoose from "mongoose";
import Trips from "../models/tripModel.js";
import Plans from "../models/planModel.js";

export const createTrip = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { tripName, city, startDate, endDate, image } = req.body;

    if (!(tripName && city && startDate && endDate && image)) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required. Please enter tripName, city, startDate, endDate, image.",
      });
    }

    // // Kiểm tra xem plans có tồn tại không
    // const plan = await Plans.findById(plans);
    // if (!plan) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Plan not found",
    //   });
    // }

    // Tạo trip mới
    const trip = await Trips.create({
      user: userId,
      tripName,
      city,
      startDate,
      endDate,
      image,
      // plans: plan._id, // Gán ID của plan đã tìm thấy
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

export const getTrips = async (req, res, next) => {
  try {
    // const { cat, writerId } = req.query;
    const { userId } = req.body.user; // Lấy userId từ user đã đăng nhập

    // if (cat) {
    //   query.cat = cat;
    // } else if (writerId) {
    //   query.user = writerId;
    // }

    let query = { user: userId, status: true };

    let queryResult = Trips.find(query)
      .populate({
        path: "user",
        select: "name image -password",
      })
      .populate({
        path: "plans",
        select: "planName startDate startTime endDate endTime address info",
      })
      .sort({ _id: -1 });

    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    //records count
    const totalTrips = await Trips.countDocuments(query);

    const numOfPage = Math.ceil(totalTrips / limit);

    queryResult = queryResult.skip(skip).limit(limit);

    const trips = await queryResult;

    res.status(200).json({
      success: true,
      totalTrips: totalTrips,
      data: trips,
      page,
      numOfPage,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    const trip = await Trips.findById(tripId)
      .populate({
        path: "user",
        select: "name image -password",
      })
      .populate({
        path: "plans",
        select: "planName startDate startTime endDate endTime address info",
      });

    await Trips.findByIdAndUpdate(tripId, trip);

    res.status(200).json({
      success: true,
      message: "Successful",
      data: trip,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const updateTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tripName, city, startDate, endDate, image } = req.body;

    const updatedFields = {};
    if (tripName) updatedFields.tripName = tripName;
    if (city) updatedFields.city = city;
    if (startDate) updatedFields.startDate = startDate;
    if (endDate) updatedFields.endDate = endDate;
    if (image) updatedFields.image = image;

    const trip = await Trips.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Trip updated successfully",
      data: trip,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
