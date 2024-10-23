import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { updateUserForgetPasswordTokenById as _updateUserForgetPasswordTokenById } from "../model/repository.js";

export const sendEmail = async (email, userId) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);
    await _updateUserForgetPasswordTokenById(
      userId,
      hashedToken,
      Date.now() + 3600000 // 1 hour
    );
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "",
      to: email,
      subject: "Reset your password",
      html: `<p>Please click <a href="${process.env.DOMAIN}/resetpassword}?token=${hashedToken}">here</a> to Reset your password
                or copy paste the link below in your browser. The link is only valid for 1 hour.
                <br>${process.env.DOMAIN}/verifyemail?token=${hashedToken}</br>
            </p>`,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    throw new Error(error.message);
  }
};
