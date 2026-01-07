import nodemailer from "nodemailer";
import { google } from "googleapis";

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
  const accessToken = await oauth2Client.getAccessToken();

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });
};

export const sendOrderNotification = async (order) => {
  try {
    const transporter = await createTransporter();

    const itemsHtml = order.orderItems
      .map((item) => `<li>${item.name} × ${item.quantity} — ₹${item.price}</li>`)
      .join("");

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: "🛒 New Order Received",
      html: `
        <h2>New Order Received</h2>
        <p><b>Name:</b> ${order.name}</p>
        <p><b>Mobile:</b> ${order.mobile}</p>
        <p><b>Address:</b> ${order.shippingAddress}</p>
        <ul>${itemsHtml}</ul>
        <h3>Total: ₹${order.totalAmount}</h3>
        ${
          order.paymentScreenshot
            ? `<p><b>Payment Screenshot:</b><br/><img src="${order.paymentScreenshot}" width="300"/></p>`
            : ""
        }
      `,
    });

    console.log("✅ Admin email sent successfully");
    return true;
  } catch (err) {
    console.error("❌ Admin email sending failed:", err.message);
    return false;
  }
};
