import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config(); // Load .env

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App password
  },
});

const sendEmail = async ({ to, subject, otp, userName }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Life Gain Herbal Products" <${process.env.EMAIL_USER}>`,
      to,
      subject: subject || "Your OTP Code",
      text: `Hello ${userName || ""},

Your OTP for Life Gain Herbal Products is: ${otp}

This code is valid for 10 minutes.

If you did not request this, please ignore this email.

Thanks,
Life Gain Herbal Products Team`,
    });

    console.log(`📩 Email successfully sent to: ${to}`);
    console.log("Response:", info.response);
    return info;
  } catch (err) {
    console.error(`❌ Failed to send email to: ${to}`);
    console.error(err);
    throw err;
  }
};

export default sendEmail;
