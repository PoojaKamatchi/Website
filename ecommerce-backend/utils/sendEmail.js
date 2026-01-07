import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, otp, userName }) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email credentials not set in environment variables");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail", // or any SMTP service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Life Gain" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; text-align:center; padding:20px;">
          <h2>Hello ${userName},</h2>
          <p>Your OTP is:</p>
          <h1 style="color:#007BFF;">${otp}</h1>
          <p>It will expire in 10 minutes.</p>
          <hr/>
          <p>Life Gain Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP sent to ${to}`);
  } catch (err) {
    console.error("❌ Email sending error:", err.message);
    throw err; // throw so controller can catch it
  }
};

export default sendEmail;
