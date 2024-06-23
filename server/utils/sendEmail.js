import dotenv from "dotenv";
import nodemailer from "nodemailer";
import Verification from "../models/emailVerification.js";
import { generateOTP, hashString } from "./index.js";

dotenv.config();

const { AUTH_EMAIL, AUTH_PASSWORD } = process.env;

let transporter = nodemailer.createTransport({
  // host: "smtp-mail.outlook.com",
  // auth: {
  //   user: AUTH_EMAIL,
  //   pass: AUTH_PASSWORD,
  // },
  service: "gmail",
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASSWORD,
  },
  secure: true,
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendVerificationEmail = async (user, res, token) => {
  const { _id, email, name } = user;
  const otp = generateOTP();

  //   mail options
  const mailOptions = {
    from: AUTH_EMAIL,
    to: email,
    subject: "Xác thực tài khoản SmartTour của bạn",
    html: `<body style="background-color:#f6f9fc;padding:10px 0">
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation"
        style="max-width:37.5em;background-color:#ffffff;border:1px solid #f0f0f0;padding:45px">
        <tbody>
            <tr style="width:100%">
                <td>
                    <div
                        style="font-family:HelveticaNeue-Medium,Helvetica,Arial,sans-serif; width: 212px; height: 88px; display: block; margin: 0 auto; text-align: center; line-height: 88px;">
                        <span style="font-size: 30px; font-weight: bold;">Smart</span>
                        <span style="font-size: 36px; font-weight: bold ; color:#1778d8e5;">Tour</span>
                    </div>
                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                        <tbody>
                            <tr>
                                <td>
                                    <p
                                        style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">
                                        Xin chào ${name},</p>
                                    <p
                                        style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">
                                        Mã OTP xác thực tài khoản của bạn là:</p>

                                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0"
                                        role="presentation"
                                        style="background:rgba(0,0,0,.05);border-radius:4px;margin:16px auto 14px;vertical-align:middle;width:280px">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <p
                                                        style="font-size:32px;line-height:40px;margin:0 auto;color:#000;display:inline-block;font-family:HelveticaNeue-Bold;font-weight:700;letter-spacing:6px;padding-bottom:8px;padding-top:8px;width:100%;text-align:center">
                                                        ${otp}</p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <p
                                        style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">
                                        Để xác thưc tài khoản bạn trên SmartTour, chúng tôi cần xác minh địa chỉ
                                        email của bạn. Hãy dán mã này vào trình duyệt.</p>

                                    <p
                                        style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">
                                        Đây là mã dùng một lần có hiệu lực trong 2 phút.
                                    </p>
                                    <p
                                        style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">
                                        Để giữ an toàn cho tài khoản của bạn, vui lòng không chia sẻ mã hoặc chuyển
                                        tiếp email này cho bất kỳ ai.
                                    </p>
                                    <p
                                        style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">
                                        Liên hệ <a href="tiendung8a6@gmail.com"
                                            style="color:#444;text-decoration:underline"
                                            target="_blank">tiendung8a6@gmail.com</a> nếu gặp khó khăn trong quá trình
                                        xác thực.</p>
                                    <p
                                        style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">
                                        Cảm ơn bạn!</p>
                                    <p
                                        style="font-size:16px;line-height:2px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">
                                        SmartTour</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
    <p
        style="font-size:12px;line-height:23px;margin:0;color:#000;font-weight:800;letter-spacing:0;margin-top:20px;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;text-align:center;text-transform:uppercase">
        © Copyright 2024 SmartTour. All rights reserved.</p>
</body>`,
  };

  try {
    const hashedToken = await hashString(String(otp));

    const newVerifiedEmail = await Verification.create({
      userId: _id,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 120000,
    });

    if (newVerifiedEmail) {
      transporter
        .sendMail(mailOptions)
        .then(() => {
          res.status(201).send({
            success: "PENDING",
            message:
              "OTP đã được gửi thành công. Hãy kiểm tra email và xác minh tài khoản của bạn.",
            user,
            token,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(404).json({ message: "Đã xảy ra lỗi" });
        });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Đã xảy ra lỗi" });
  }
};
