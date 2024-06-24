import mongoose from "mongoose";
import Trips from "../models/tripModel.js";
import Plans from "../models/planModel.js";
import Users from "../models/userModel.js";
import Notifications from "../models/notificationModel.js";

export const createTrip = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const {
      tripName,
      city,
      startDate,
      endDate,
      image,
      status,
      total,
      description,
      hashtag,
    } = req.body;

    if (!(tripName && city && startDate && endDate && image && total)) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập các trường bắt buộc",
      });
    }

    // Kiểm tra số điểm hiện tại của người dùng ==> Kiểm tra bên Client

    // Tạo trip mới
    const trip = await Trips.create({
      user: userId,
      tripName,
      city,
      startDate,
      endDate,
      image,
      status,
      total,
      description,
      hashtag,
      receivedPoints: status,
    });

    // Trừ 10 điểm của người dùng
    await Users.findByIdAndUpdate(userId, { $inc: { points: -20 } });
    await Notifications.create({
      user: userId,
      pointsDeducted: -20,
      reason: `Trừ 20 điểm vì đã tạo chuyến đi ${trip.tripName}`,
    });

    // Thêm điểm nếu chuyến đi được công khai
    if (status) {
      await Users.findByIdAndUpdate(userId, { $inc: { points: 5 } });
      await Notifications.create({
        user: userId,
        pointsDeducted: 5,
        reason: `Nhận được 5 điểm vì đã công khai chuyến đi ${trip.tripName}`,
      });
    }

    await Users.findByIdAndUpdate(userId, { $push: { viewedTrips: trip._id } });

    res.status(200).json({
      success: true,
      message: "Chuyến đi được tạo thành công",
      data: trip,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ" });
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

    // let query = { user: userId, status: true };
    let query = { user: userId };

    let queryResult = Trips.find(query)
      .populate({
        path: "user",
        select: "name image -password",
      })
      .populate({
        path: "plans",
        select: "",
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
export const getAdminTrips = async (req, res, next) => {
  try {
    let queryResult = Trips.find()
      .populate({
        path: "user",
        select: "name image -password",
      })
      .populate({
        path: "plans",
        select: "",
      })
      .sort({ _id: -1 });
    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    //records count
    const totalTrips = await Trips.countDocuments();

    const numOfPage = Math.ceil(totalTrips / limit);

    queryResult = queryResult.skip(skip).limit(limit);

    const trips = await queryResult;

    res.status(200).json({
      success: true,
      message: "Dữ liệu chuyến đi đã được tải thành công",
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
        select: "", // Object trống để lấy tất cả các trường
      });

    await Trips.findByIdAndUpdate(tripId, trip);

    res.status(200).json({
      success: true,
      message: "Thành công",
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
    const {
      tripName,
      city,
      startDate,
      endDate,
      image,
      status,
      total,
      description,
      hashtag,
    } = req.body;

    const updatedFields = {};
    if (tripName) updatedFields.tripName = tripName;
    if (city) updatedFields.city = city;
    if (startDate) updatedFields.startDate = startDate;
    if (endDate) updatedFields.endDate = endDate;
    if (image) updatedFields.image = image;
    if (status !== undefined) updatedFields.status = status; // Change the way of checking status
    if (total) updatedFields.total = total;
    if (description) updatedFields.description = description;
    if (hashtag) updatedFields.hashtag = hashtag;

    const trip = await Trips.findById(id);

    // Cập nhật điểm thưởng nếu cập nhật status là true và receivedPoints là false
    if (status && !trip.receivedPoints) {
      await Users.findByIdAndUpdate(req.body.user.userId, {
        $inc: { points: 10 },
      });
      await Notifications.create({
        user: req.body.user.userId,
        pointsDeducted: 10,
        reason: `Nhận được 10 điểm vì đã công khai chuyến đi ${trip.tripName}`,
      });
    }

    // Cập nhật receivedPoints nếu status là true
    if (status && !trip.receivedPoints) {
      updatedFields.receivedPoints = true;
    }

    const updatedTrip = await Trips.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Chuyến đi được cập nhật thành công",
      data: updatedTrip,
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error.message });
  }
};

export const deleteTrip = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Trips.findOneAndDelete({ _id: id });

    res.status(200).json({
      success: true,
      message: "Xóa chuyến đi thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const updateTripStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const trip = await Trips.findByIdAndUpdate(id, { status }, { new: true });

    res.status(200).json({
      sucess: true,
      message: "Trạng thái đã được cập nhật thành công",
      data: trip,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
export const getPublicTrips = async (req, res, next) => {
  try {
    const query = { status: true };

    let queryResult = Trips.find(query)
      .populate({
        path: "user",
        select: "name image -password",
      })
      .populate({
        path: "plans",
        select: "",
      })
      .sort({ _id: -1 });

    // Phân trang
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Số lượng chuyến đi
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

export const activateTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body.user;

    const trip = await Trips.findById(id);

    // Kiểm tra xem chuyến đi
    if (trip.status === false) {
      return res.status(400).json({
        success: false,
        message: "Chuyến đi chưa được công khai",
      });
    }

    // Kiểm tra xem user đã xem chuyến đi
    const user = await Users.findById(userId);
    if (user.viewedTrips.includes(id)) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã kích hoạt xem chuyến đi này trước đó.",
      });
    }

    // Trừ 10 điểm nếu người dùng không phải là chủ sở hữu của chuyến đi
    if (trip.user.toString() !== userId) {
      const userPoints = user.points || 0;
      if (userPoints < 10) {
        return res.status(400).json({
          success: false,
          message: "Bạn không có đủ điểm để xem chuyến đi.",
        });
      }
      await Users.findByIdAndUpdate(
        userId,
        { $inc: { points: -10 } }, // Trừ 10 điểm
        { new: true }
      );

      await Notifications.create({
        user: userId,
        pointsDeducted: -10,
        reason: `Trừ 10 điểm kích hoạt xem chuyến đi công khai ${trip.tripName}`,
      });
    }

    // Lưu thông tin chuyến đi
    if (trip.user.toString() !== userId) {
      await Users.findByIdAndUpdate(
        userId,
        { $addToSet: { viewedTrips: id } }, // Thêm trip vào mảng viewedTrips
        { new: true }
      );
    }

    // Cập nhật 5 điểm thưởng
    if (trip.user.toString() !== userId) {
      await Users.findByIdAndUpdate(
        trip.user,
        { $inc: { points: 5 } },
        { new: true }
      );
      // Ghi lại thông báo vào bảng Notifications
      await Notifications.create({
        user: trip.user,
        pointsDeducted: 5,
        reason: `Nhận được 5 điểm vì có người dùng xem chuyến đi ${trip.tripName}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Kích hoạt xem chuyến đi công khai thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
