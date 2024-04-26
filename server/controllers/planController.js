import mongoose from "mongoose";
import Trips from "../models/tripModel.js";
import Plans from "../models/planModel.js";

export const createPlanActivity = async (req, res, next) => {
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
      type: "activity",
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
      message:
        "Lập kế hoạch cho hoạt động thành công và đã được thêm vào chuyến đi",
      data: plan,
      tripId: trip._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createPlanLodging = async (req, res, next) => {
  try {
    const {
      planName,
      startDate,
      startTime,
      endDate,
      endTime,
      address,
      info,
      phone,
      web,
      email,
      number,
      describe,
    } = req.body;
    const { id } = req.params;

    const plan = await Plans.create({
      planName,
      startDate,
      startTime,
      endDate,
      endTime,
      address,
      info,
      phone,
      web,
      email,
      number,
      describe,
      type: "lodging",
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
      message:
        "Lập kế hoạch cho khách sạn thành công và đã được thêm vào chuyến đi",
      data: plan,
      tripId: trip._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createPlanFlights = async (req, res, next) => {
  try {
    const {
      planName,
      startDate,
      startTime,
      endDate,
      endTime,
      address,
      info,
      phone,
      web,
      email,
      number,
      describe,
      form,
      price,
      destination,
      arrivalGate,
      departureGate,
    } = req.body;
    const { id } = req.params;

    const plan = await Plans.create({
      planName,
      startDate,
      startTime,
      endDate,
      endTime,
      address,
      info,
      phone,
      web,
      email,
      number,
      describe,
      form,
      price,
      destination,
      arrivalGate,
      departureGate,
      type: "flights",
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
      message:
        "Lập kế hoạch cho chuyến bay thành công và đã được thêm vào chuyến đi",
      data: plan,
      tripId: trip._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createPlanCar = async (req, res, next) => {
  try {
    const {
      planName,
      startDate,
      startTime,
      endDate,
      endTime,
      address,
      phone,
      web,
      email,
      total,
      describe,
      form,
      price,
    } = req.body;
    const { id } = req.params;

    const plan = await Plans.create({
      planName,
      startDate,
      startTime,
      endDate,
      endTime,
      address,
      phone,
      web,
      email,
      total,
      describe,
      form,
      price,
      type: "car",
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
      message: "Lập kế hoạch thuê xe thành công và đã được thêm vào chuyến đi",
      data: plan,
      tripId: trip._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createPlanConcert = async (req, res, next) => {
  try {
    const {
      planName,
      startDate,
      startTime,
      endDate,
      endTime,
      address,
      info,
      phone,
      web,
      email,
      number,
      describe,
      form,
      price,
      departureGate,
    } = req.body;
    const { id } = req.params;

    const plan = await Plans.create({
      planName,
      startDate,
      startTime,
      endDate,
      endTime,
      address,
      info,
      phone,
      web,
      email,
      number,
      describe,
      form,
      price,
      departureGate,
      type: "concert",
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
      message:
        "Lập kế hoạch cho buổi hòa nhạc thành công và đã được thêm vào chuyến đi",
      data: plan,
      tripId: trip._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const createPlanTheater = async (req, res, next) => {
  try {
    const {
      planName,
      startDate,
      startTime,
      endDate,
      endTime,
      address,
      info,
      phone,
      web,
      email,
      number,
      describe,
      form,
      price,
      departureGate,
    } = req.body;
    const { id } = req.params;

    const plan = await Plans.create({
      planName,
      startDate,
      startTime,
      endDate,
      endTime,
      address,
      info,
      phone,
      web,
      email,
      number,
      describe,
      form,
      price,
      departureGate,
      type: "theater",
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
      message:
        "Lập kế hoạch cho xem phim thành công và đã được thêm vào chuyến đi",
      data: plan,
      tripId: trip._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const createPlanCamp = async (req, res, next) => {
  try {
    const {
      planName,
      startDate,
      startTime,
      endDate,
      endTime,
      address,
      info,
      phone,
      web,
      email,
      number,
      describe,
      form,
      price,
      departureGate,
    } = req.body;
    const { id } = req.params;

    const plan = await Plans.create({
      planName,
      startDate,
      startTime,
      endDate,
      endTime,
      address,
      info,
      phone,
      web,
      email,
      number,
      describe,
      form,
      price,
      departureGate,
      type: "camp",
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
      message:
        "Lập kế hoạch cho cắm trại thành công và đã được thêm vào chuyến đi",
      data: plan,
      tripId: trip._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const createPlanParking = async (req, res, next) => {
  try {
    const {
      planName,
      startDate,
      startTime,
      endDate,
      endTime,
      address,
      info,
      phone,
      web,
      email,
      total,
      price,
    } = req.body;
    const { id } = req.params;

    const plan = await Plans.create({
      planName,
      startDate,
      startTime,
      endDate,
      endTime,
      address,
      info,
      phone,
      web,
      email,
      total,
      price,
      type: "parking",
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
      message:
        "Lập kế hoạch cho đỗ xe thành công và đã được thêm vào chuyến đi",
      data: plan,
      tripId: trip._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const createPlanRestaurant = async (req, res, next) => {
  try {
    const {
      planName,
      startDate,
      startTime,
      endDate,
      endTime,
      address,
      info,
      phone,
      web,
      email,
      describe,
      form,
      price,
    } = req.body;
    const { id } = req.params;

    const plan = await Plans.create({
      planName,
      startDate,
      startTime,
      endDate,
      endTime,
      address,
      info,
      phone,
      web,
      email,
      describe,
      form,
      price,
      type: "restaurant",
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
      message:
        "Lập kế hoạch cho nhà hàng thành công và đã được thêm vào chuyến đi",
      data: plan,
      tripId: trip._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
