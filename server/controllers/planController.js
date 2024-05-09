import mongoose from "mongoose";
import Trips from "../models/tripModel.js";
import Plans from "../models/planModel.js";

export const createPlanActivity = async (req, res, next) => {
  try {
    const {
      planName,
      startDate,
      startTime,
      endDate,
      endTime,
      startAddress,
      info,
      estimatedPrice,
      actualPrice,
    } = req.body;
    const { id } = req.params;

    const price = actualPrice ? actualPrice : estimatedPrice;

    const plan = await Plans.create({
      planName,
      startDate,
      startTime,
      endDate,
      endTime,
      estimatedPrice,
      actualPrice: price,
      startAddress,
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
      startAddress,
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
      startAddress,
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
      startAddress,
      info,
      phone,
      web,
      email,
      number,
      describe,
      form,
      price,
      endAddress,
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
      startAddress,
      info,
      phone,
      web,
      email,
      number,
      describe,
      form,
      price,
      endAddress,
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
      startAddress,
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
      startAddress,
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
      startAddress,
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
      startAddress,
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
      startAddress,
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
      startAddress,
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
      startAddress,
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
      startAddress,
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
      startAddress,
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
      startAddress,
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
      startAddress,
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
      startAddress,
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
export const createPlanRail = async (req, res, next) => {
  try {
    const {
      planName,
      startDate,
      startTime,
      endDate,
      endTime,
      startAddress,
      info,
      phone,
      web,
      email,
      number,
      describe,
      form,
      price,
      endAddress,
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
      startAddress,
      info,
      phone,
      web,
      email,
      number,
      describe,
      form,
      price,
      endAddress,
      arrivalGate,
      departureGate,
      type: "rail",
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
        "Lập kế hoạch cho đường sắt thành công và đã được thêm vào chuyến đi",
      data: plan,
      tripId: trip._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const getPlanById = async (req, res, next) => {
  try {
    const { planId } = req.params;

    const plan = await Plans.findById(planId);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json({
      success: true,
      message: "Successful",
      data: plan,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePlanActivity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      planName,
      startDate,
      startTime,
      endDate,
      endTime,
      startAddress,
      info,
      estimatedPrice,
      actualPrice,
    } = req.body;

    const updatedFields = {};
    if (planName) updatedFields.planName = planName;
    if (startDate) updatedFields.startDate = startDate;
    if (startTime) updatedFields.startTime = startTime;
    if (endDate) updatedFields.endDate = endDate;
    if (endTime) updatedFields.endTime = endTime;
    if (startAddress) updatedFields.startAddress = startAddress;
    if (info) updatedFields.info = info;
    if (estimatedPrice) updatedFields.estimatedPrice = estimatedPrice;
    if (actualPrice) updatedFields.actualPrice = actualPrice;
    const plan = await Plans.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy kế hoạch cho hoạt động",
      });
    }

    res.status(200).json({
      success: true,
      message: "Kế hoạch cho hoạt động đã được cập nhật thành công.",
      data: plan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
