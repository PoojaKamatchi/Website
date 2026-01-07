import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, otp, userName }) => {
  const html = `
    <div style="font-family:Arial;padding:20px">
      <h2>Life Gain Herbal Products</h2>
      <p>Hello ${userName || "User"},</p>
      <h1 style="letter-spacing:4px">${otp}</h1>
      <p>This OTP is valid for 10 minutes.</p>
    </div>
  `;

  return transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
};

export default sendEmail;
