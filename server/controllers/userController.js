import Verification from "../models/emailVerification.js";
import Followers from "../models/followers.js";
import Users from "../models/userModel.js";
import Contact from "../models/contactModel.js";
import Policy from "../models/policyModel.js";
import Posts from "../models/postModel.js";
import Comments from "../models/commentModel.js";
import { compareString, createJWT, hashString } from "../utils/index.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import Contacts from "../models/contactModel.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
});

export const sendReplyEmail = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    // Tìm kiếm contact theo ID
    const contact = await Contacts.findById(id);

    if (!contact) {
      return res.status(404).json({ message: "Không tìm thấy liên hệ" });
    }

    // // Kiểm tra xem email đã được gửi phản hồi trước đó hay chưa
    // if (contact.isReply) {
    //   return res
    //     .status(400)
    //     .json({ message: "Email response has been sent already" });
    // }

    // Gửi email phản hồi
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: contact.email,
      subject: "Phản hồi từ SmartTour",
      html: `<p>${content}</p>`, // Lấy nội dung từ req.body.content
    };

    await transporter.sendMail(mailOptions);

    // Cập nhật cờ isReply của contact thành true
    contact.isReply = true;
    contact.content = content; // Lưu lại nội dung đã gửi
    await contact.save();

    res.status(200).json({ message: "Đã gửi phản hồi email thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Không thể gửi phản hồi" });
  }
};

export const OPTVerification = async (req, res, next) => {
  try {
    const { userId, otp } = req.params;

    const result = await Verification.findOne({ userId });

    const { expiresAt, token } = result;

    // token has expired, delete token
    if (expiresAt < Date.now()) {
      await Verification.findOneAndDelete({ userId });

      const message = "Mã xác thực người dùng đã hết hạn.";
      res.status(404).json({ message });
    } else {
      const isMatch = await compareString(otp, token);

      if (isMatch) {
        await Promise.all([
          Users.findOneAndUpdate({ _id: userId }, { emailVerified: true }),
          Verification.findOneAndDelete({ userId }),
        ]);

        const message = "Email đã được xác minh thành công";
        res.status(200).json({ message });
      } else {
        const message = "Xác minh không thành công hoặc liên kết không hợp lệ";
        res.status(404).json({ message });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Đã xảy ra lỗi. Vui lòng thử lại!" });
  }
};

export const resendOTP = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Verification.findOneAndDelete({ userId: id });

    const user = await Users.findById(id);

    user.password = undefined;

    const token = createJWT(user?._id);

    if (user?.accountType === "Writer") {
      sendVerificationEmail(user, res, token);
    } else
      res.status(404).json({ message: "Đã xảy ra lỗi. Vui lòng thử lại!" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Đã xảy ra lỗi. Vui lòng thử lại!" });
  }
};

export const followWritter = async (req, res, next) => {
  try {
    const followerId = req.body.user.userId;
    const { id } = req.params;

    const checks = await Followers.findOne({ followerId, writerId: id });

    if (checks)
      return res.status(201).json({
        success: false,
        message: "Bạn đã theo dõi tác giả này.",
      });

    const writer = await Users.findById(id);

    const newFollower = await Followers.create({
      followerId,
      writerId: id,
    });

    writer?.followers?.push(newFollower?._id);

    await Users.findByIdAndUpdate(id, writer, { new: true });

    res.status(201).json({
      success: true,
      message: "Bạn hiện đang theo dõi tác giả " + writer?.name,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { firstName, lastName, image } = req.body;

    if (!(firstName || lastName)) {
      return next("Vui lòng cung cấp tất cả các trường bắt buộc");
    }

    const updateUser = {
      name: firstName + " " + lastName,
      image,
      _id: userId,
    };

    const user = await Users.findByIdAndUpdate(userId, updateUser, {
      new: true,
    });

    const token = createJWT(user?._id);

    user.password = undefined;

    res.status(200).json({
      sucess: true,
      message: "Cập nhật thành công",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getWriter = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await Users.findById(id).populate({
      path: "followers",
      select: "followerId",
    });

    if (!user) {
      return res.status(200).send({
        success: false,
        message: "Không tìm thấy",
      });
    }

    user.password = undefined;

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Đã xảy ra lỗi. Vui lòng thử lại!" });
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    let queryResult = Users.find().sort({
      _id: -1,
    });

    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    //records count
    const totalUsers = await Users.countDocuments();
    const numOfPages = Math.ceil(totalUsers / limit);

    queryResult = queryResult.skip(skip).limit(limit);

    const users = await queryResult;

    res.status(200).json({
      success: true,
      message: "Dữ liệu người dùng đã tải thành công",
      totalUsers,
      data: users,
      page,
      numOfPages,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const updateUserLock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isLock } = req.body;

    const user = await Users.findByIdAndUpdate(id, { isLock }, { new: true });

    res.status(200).json({
      success: true,
      message: "Trạng thái người dùng được cập nhật thành công",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const deleteUser = async (req, res, next) => {
  // Admin Only can delete post
  try {
    const { id } = req.params;

    // Find the followers with the given followerId
    const followers = await Followers.find({ followerId: id });
    const followerIds = followers.map((follower) => follower._id); // Extract the IDs of followers

    const userComments = await Comments.find({ user: id });

    // Delete the Users
    await Users.findOneAndDelete({ _id: id });

    // Remove the user from followers array in Users table
    await Users.updateMany(
      { followers: { $in: followerIds } },
      { $pull: { followers: { $in: followerIds } } }
    );

    // Delete followers
    await Followers.deleteMany({ followerId: id });

    // Delete posts
    await Posts.deleteMany({ user: id });

    for (let comment of userComments) {
      await Posts.updateMany(
        { comments: { $in: [comment._id] } },
        { $pull: { comments: comment._id } }
      );
    }

    // Delete comments
    await Comments.deleteMany({ user: id });

    res.status(200).json({
      success: true,
      message: "Đã xoá người dùng thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const createContact = async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res
      .status(400)
      .json({ message: "Name, email, phone, and message are required fields" });
  }

  try {
    // Create a new contact
    const newContact = new Contact({
      name,
      email,
      phone,
      message,
    });

    // Save the new contact
    await newContact.save();

    res.status(201).json({ message: "Liên hệ được gửi thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Không gửi được liên hệ" });
  }
};

export const updatePolicy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const policy = await Policy.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Chính sách được cập nhật thành công",
      data: policy,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getPolicyContent = async (req, res, next) => {
  try {
    let queryResult = Policy.find().sort({
      _id: -1,
    });

    // Phân trang
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Số lượng bản ghi
    const totalPolicies = await Policy.countDocuments();
    const numOfPages = Math.ceil(totalPolicies / limit);

    queryResult = queryResult.skip(skip).limit(limit);

    const policies = await queryResult;

    res.status(200).json({
      success: true,
      message: "Dữ liệu chính sách đã được tải thành công",
      totalPolicies,
      data: policies,
      page,
      numOfPages,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getContactsContent = async (req, res, next) => {
  try {
    let queryResult = Contacts.find().sort({
      _id: -1,
    });

    // Phân trang
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Số lượng bản ghi
    const totalContacts = await Contacts.countDocuments();
    const numOfPages = Math.ceil(totalContacts / limit);

    queryResult = queryResult.skip(skip).limit(limit);

    const contacts = await queryResult;

    res.status(200).json({
      success: true,
      message: "Dữ liệu liên hệ đã được tải lên thành công",
      totalContacts,
      data: contacts,
      page,
      numOfPages,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Users.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Xóa trường password trước khi gửi response
    user.password = undefined;

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Không lấy được thông tin người dùng" });
  }
};
export const getUsersNotifications = async (req, res, next) => {
  try {
    // Truy vấn tất cả và sắp xếp theo thời gian tạo
    const users = await Users.find({
      isAdmin: false,
      emailVerified: true,
      isLock: false,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: "Người dùng được truy xuất thành công",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
export const getPolicy = async (req, res, next) => {
  try {
    const policies = await Policy.find().sort({
      _id: -1,
    });

    res.status(200).json({
      success: true,
      message: "Dữ liệu chính sách đã được tải thành công",
      data: policies,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Đã xảy ra lỗi. Vui lòng thử lại!" });
  }
};
