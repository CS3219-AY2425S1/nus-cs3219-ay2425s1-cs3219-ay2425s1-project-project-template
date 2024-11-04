import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { updateUserForgetPasswordTokenById as _updateUserForgetPasswordTokenById } from "../model/repository.js";

export const sendEmail = async (email, userId) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);
    while (
      hashedToken.charAt(hashedToken.length - 1) === "." ||
      hashedToken.includes("/")
    ) {
      hashedToken = await bcrypt.hash(userId.toString(), 10);
    }
    await _updateUserForgetPasswordTokenById(
      userId,
      hashedToken,
      Date.now() + 3600000 // 1 hour
    );
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const domain =
      process.env.ENV === "PROD"
        ? process.env.CLOUD_DOMAIN
        : "http://localhost:" + process.env.FRONTEND_PORT;
    const messageBody = `<p>Please click <a href="${domain}/resetpassword?token=${hashedToken}">here</a> to Reset your password or copy paste the link below in your browser. The link is only valid for 1 hour.
          <br>${domain}/resetpassword?token=${hashedToken}</br>
      </p>`;

    const mailOptions = {
      from: "",
      to: email,
      subject: "Reset your password",
      html: messageBody,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    throw new Error(error.message);
  }
};
