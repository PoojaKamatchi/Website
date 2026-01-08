import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, otp, userName }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>Hello ${userName},</h2>
          <p>Your OTP is:</p>
          <h1 style="color:#2563eb">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
          <br/>
          <b>Life Gain Team</b>
        </div>
      `,
    });

    console.log("✅ OTP email sent to", to);
    return true;
  } catch (err) {
    console.error("❌ Email failed:", err.message);
    return false;
  }
};

export default sendEmail;
