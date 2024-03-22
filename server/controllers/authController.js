import Users from "../models/userModel.js";
import Contacts from "../models/contactModel.js";
import { compareString, createJWT, hashString } from "../utils/index.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import nodemailer from "nodemailer";

const { AUTH_EMAIL, AUTH_PASSWORD } = process.env;

export const register = async (req, res, next) => {
  const { firstName, lastName, email, password, image, accountType, provider } =
    req.body;

  //validate fileds
  if (!(firstName || lastName || email || password)) {
    return next("Provide Required Fields!");
  }

  if (accountType === "Writer" && !image)
    return next("Please provide profile picture");

  try {
    const userExist = await Users.findOne({ email });

    if (userExist) {
      return next("Email Address already exists. Try Login");
    }

    const hashedPassword = await hashString(password);

    const user = await Users.create({
      name: firstName + " " + lastName,
      email,
      password: !provider ? hashedPassword : "",
      image,
      accountType,
      provider,
    });

    user.password = undefined;

    const token = createJWT(user?._id);

    //send email verification if account type is writer
    if (accountType === "Writer") {
      sendVerificationEmail(user, res, token);
    } else {
      res.status(201).json({
        success: true,
        message: "Account created successfully",
        user,
        token,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const googleSignUp = async (req, res, next) => {
  const { name, email, image, emailVerified } = req.body;

  try {
    const userExist = await Users.findOne({ email });

    if (userExist) {
      next("Email Address already exists. Try Login");
      return;
    }

    const user = await Users.create({
      name,
      email,
      image,
      provider: "Google",
      emailVerified,
    });

    user.password = undefined;

    const token = createJWT(user?._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //validation
    if (!email) {
      return next("Please Provide User Credentials");
    }
    // if (!password) {
    //   next("Please Provide User Credentials");
    //   return;
    // }

    // find user by email
    const user = await Users.findOne({ email }).select("+password");

    if (!user) {
      return next("Invalid email or password");
    }

    // Check if the account is locked
    if (user.isLock) {
      return next("This account has been locked");
    }

    // Google account signed in
    if (!password && user?.provider === "Google") {
      const token = createJWT(user?._id);

      return res.status(201).json({
        success: true,
        message: "Login successfully",
        user,
        token,
      });
    }

    // compare password
    const isMatch = await compareString(password, user?.password);

    if (!isMatch) {
      return next("Invalid email or password");
    }

    // if (user?.accountType === "Writer" && !user?.emailVerified) {
    if (!user?.emailVerified) {
      return next("Please verify your email address.");
    }

    user.password = undefined;

    const token = createJWT(user?._id);

    res.status(201).json({
      success: true,
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: "failed", message: error.message });
  }
};

export const loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // validation
    if (!email || !password) {
      return next("Please provide user credentials");
    }

    // find user by email
    const user = await Users.findOne({ email }).select("+password");

    if (!user) {
      return next("Invalid email or password");
    }

    // Check if the account is locked
    if (user.isLock) {
      return next("This account has been locked");
    }

    // Check if the user is an admin
    if (!user.isAdmin) {
      return next("Access denied. Insufficient permissions");
    }

    // compare password
    const isMatch = await compareString(password, user.password);

    if (!isMatch) {
      return next("Invalid email or password");
    }

    if (!user.emailVerified) {
      return next("Please verify your email address.");
    }

    user.password = undefined;

    const token = createJWT(user._id);

    res.status(201).json({
      success: true,
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: error.message });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASSWORD,
  },
});

// const generateRandomPassword = () => {
//   const length = 10;
//   const charset =
//     "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

//   let password = "";
//   for (let i = 0; i < length; i++) {
//     const randomIndex = Math.floor(Math.random() * charset.length);
//     password += charset[randomIndex];
//   }

//   return password;
// };

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await Users.findOne({ email });

    if (!user) {
      return next("Email does not exist");
    }

    // const newPassword = generateRandomPassword();
    const newPassword = Math.random().toString(36).slice(-8);

    const hashedPassword = await hashString(newPassword);

    user.password = hashedPassword;
    await user.save();

    const mailOptions = {
      from: AUTH_EMAIL,
      to: email,
      subject: "Password Reset",
      html: `<div
      style='font-family: Arial, sans-serif; font-size: 20px; color: #333; background-color: #f7f7f7; padding: 20px; border-radius: 5px;'>
      <h3 style="color: rgb(8, 56, 188)">Password Reset Request</h3>
      <hr>
      <h4>Hello, </h4>
      <p>
      We have received a request to reset your password. Below is your new temporary password: 
          <br>
          <h1 styles='font-size: 20px; color: rgb(8, 56, 188);'>${newPassword}</h1>
          <p>Please use this temporary password to access your account. You should not share your password to avoid losing your account.</b></p>
      <p>If you did not request a password reset, please ignore this email.</b></p>
      </p>
      <div style="margin-top: 20px;">
          <h5>Regards,</h5>
          <h5>SmartTour</h5>
      </div>
  </div>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error occurred while sending email:", error);
        return next("Error occurred while sending email");
      } else {
        console.log("Email sent:", info.response);
        res
          .status(200)
          .json({ success: true, message: "New password sent to your email" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getContacts = async (req, res, next) => {
  try {
    let queryResult = Contacts.find().sort({
      _id: -1,
    });

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalContacts = await Contacts.countDocuments(queryResult);

    const numOfPage = Math.ceil(totalContacts / limit);

    queryResult = queryResult.skip(skip).limit(limit);

    const contacts = await queryResult;

    res.status(200).json({
      success: true,
      totalContacts,
      data: contacts,
      page,
      numOfPage,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
