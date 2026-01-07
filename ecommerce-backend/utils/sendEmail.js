import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, otp, userName }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.gmail.com", // ✅ CHANGE
    port: 587,                   // ✅ CHANGE
    secure: false,               // ✅ MUST be false
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  await transporter.verify(); // ✅ ADD THIS

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html: `
      <h2>Hello ${userName}</h2>
      <h1>${otp}</h1>
      <p>OTP valid for 10 minutes</p>
    `,
  });
};

export default sendEmail;
