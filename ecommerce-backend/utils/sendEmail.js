import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, otp, userName }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    from: `"Life Gain" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: `
      <div style="font-family: Arial; padding:20px;">
        <h2>Hello ${userName}</h2>
        <p>Your OTP:</p>
        <h1>${otp}</h1>
        <p>Valid for 10 minutes</p>
      </div>
    `,
  });
};

export default sendEmail;
