import Verification from "../models/emailVerification.js";
import Followers from "../models/followers.js";
import Users from "../models/userModel.js";
import Contact from "../models/contactModel.js";
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

export const sendEmailResponse = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    // Tìm kiếm contact theo ID
    const contact = await Contacts.findById(id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
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
      subject: "Response to SmartTour",
      html: `<p>${content}</p>`, // Lấy nội dung từ req.body.content
    };
    console.log("Content===========:", content);

    await transporter.sendMail(mailOptions);

    // Cập nhật cờ isReply của contact thành true
    contact.isReply = true;
    contact.content = content; // Lưu lại nội dung đã gửi
    await contact.save();

    res.status(200).json({ message: "Email response sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send email response" });
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

      const message = "Verification token has expired.";
      res.status(404).json({ message });
    } else {
      const isMatch = await compareString(otp, token);

      if (isMatch) {
        await Promise.all([
          Users.findOneAndUpdate({ _id: userId }, { emailVerified: true }),
          Verification.findOneAndDelete({ userId }),
        ]);

        const message = "Email verified successfully";
        res.status(200).json({ message });
      } else {
        const message = "Verification failed or link is invalid";
        res.status(404).json({ message });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Something went wrong" });
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
    } else res.status(404).json({ message: "Something went wrong" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Something went wrong" });
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
        message: "You're already following this writer.",
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
      message: "You're now following writer " + writer?.name,
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
      return next("Please provide all required fields");
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
      message: "User updated successfully",
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
        message: "Writer Not Found",
      });
    }

    user.password = undefined;

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Something went wrong" });
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
      message: "Users Loaded successfully",
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
      message: "User status updated successfully",
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

    await Users.findOneAndDelete({ _id: id });

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
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

    res.status(201).json({ message: "Contact created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create contact" });
  }
};
