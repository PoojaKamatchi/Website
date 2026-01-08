import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, otp, userName }) => {
  try {
    // Check environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("⚠️ Email ENV missing — skipping email send");
      return false;
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail", // default to gmail
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password
      },
      connectionTimeout: 10000, // 10s
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding:20px; text-align:center;">
          <h2>Hello ${userName},</h2>
          <p>Your OTP is:</p>
          <h1 style="color:#2563eb;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
          <hr />
          <p>Life Gain Team</p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${to}`);
    return true;
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    return false; // Do not throw, allow API to continue
  }
};

export default sendEmail;
