import nodemailer from "nodemailer";

/**
 * SAFE EMAIL SENDER
 * - Will NOT throw error
 * - Will NOT break API
 * - Logs failure clearly
 * - Allows OTP flow to continue
 */
const sendEmail = async ({ to, subject, otp, userName }) => {
  try {
    // ENV CHECK
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("⚠️ Email ENV missing — skipping email send");
      return true;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000, // 10s
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    const mailOptions = {
      from: `"Life Gain" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `
        <div style="font-family: Arial; padding:20px;">
          <h2>Hello ${userName},</h2>
          <p>Your OTP is:</p>
          <h1 style="color:#2563eb;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
          <hr />
          <p>Life Gain Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${to}`);
    return true;
  } catch (error) {
    // 🔴 DO NOT THROW
    console.error("❌ Email send skipped:", error.message);
    return false;
  }
};

export default sendEmail;
