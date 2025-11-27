import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  try {
    // 1️⃣ Create email transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE, // e.g., "gmail"
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 2️⃣ Email details
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.to,       // updated from options.email
      subject: options.subject,
      html: options.html,   // updated from options.message
    };

    // 3️⃣ Send mail
    await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent successfully to ${options.to}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error); // full error for debugging
    throw error; // rethrow actual error instead of generic
  }
};

export default sendEmail;
