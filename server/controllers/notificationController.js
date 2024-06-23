import Notifications from "../models/notificationModel.js";
import Users from "../models/userModel.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
});

export const createNotificationEmail = async (req, res, next) => {
  try {
    const { users, reason } = req.body;
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp lý do (reason) cho thông báo.",
      });
    }

    let userIds = [];

    // Nếu users là "all", lấy danh sách userIds từ tất cả người dùng
    if (users === "all") {
      const allUsers = await Users.find(
        { isLock: false, emailVerified: true, isAdmin: false }, //ĐK
        "_id"
      );
      userIds = allUsers.map((user) => user._id);
    } else {
      // Nếu users được chỉ định, lấy userIds từ users
      userIds = users.map((user) => user._id);
    }

    // Gửi email cho từng user
    await Promise.all(
      userIds.map(async (userId) => {
        const user = await Users.findById(userId);
        if (user && user.email) {
          const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: user.email,
            subject: "Thông báo từ SmartTour",
            html: `<p>${reason}</p>`,
          };
          await transporter.sendMail(mailOptions);
        }
      })
    );

    const notification = await Notifications.create({
      user: userIds,
      reason: reason,
      sender: "admin",
      method: "email",
    });
    res.status(200).json({
      success: true,
      message: "Thông báo đã được gửi thành công qua email.",
      data: notification,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Không thể gửi thông báo qua email." });
  }
};

export const createNotification = async (req, res, next) => {
  try {
    const { users, reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp lý do cho thông báo.",
      });
    }

    let notificationUsers = [];

    if (users === "all") {
      const allUsers = await Users.find(
        { isLock: false, emailVerified: true, isAdmin: false },
        "_id"
      );
      notificationUsers = allUsers.map((user) => user._id);
    } else {
      if (users && users.length > 0) {
        for (const userId of users) {
          const user = await Users.findById(userId);
          if (user) {
            notificationUsers.push(userId);
          }
        }
      }
    }

    const notification = await Notifications.create({
      user: notificationUsers,
      reason: reason,
      sender: "admin",
    });

    res.status(200).json({
      success: true,
      message: "Thông báo đã được gửi thành công",
      data: notification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

export const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Users.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    const notifications = await Notifications.find({
      user: id,
      method: "automatic",
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Không thấy thông báo" });
  }
};

export const getAdminNotifications = async (req, res, next) => {
  try {
    let queryResult = Notifications.find()
      .populate({
        path: "user",
        select: "name image email -password",
      })
      .sort({ createdAt: -1 });

    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // records count
    const totalNotifications = await Notifications.countDocuments();

    const numOfPage = Math.ceil(totalNotifications / limit);

    queryResult = queryResult.skip(skip).limit(limit);

    const notifications = await queryResult;

    res.status(200).json({
      success: true,
      message: "Dữ liệu thông báo đã được tải thành công",
      totalNotifications: totalNotifications,
      data: notifications,
      page,
      numOfPage,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
export const deleteNotifications = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Notifications.findOneAndDelete({ _id: id });

    res.status(200).json({
      success: true,
      message: "Xóa thông báo thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
