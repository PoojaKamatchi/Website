import nodemailer from "nodemailer";

export const sendOrderNotification = async (order) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com", // Brevo SMTP server
      port: 587,                     // TLS port (use 465 if secure: true)
      secure: false,                 // false for 587
      auth: {
        user: process.env.EMAIL_USER, // MUST be 'apikey'
        pass: process.env.EMAIL_PASS, // Brevo SMTP key
      },
    });

    const itemsHtml = order.orderItems
      .map(
        (item) =>
          `<li>${item.name} × ${item.quantity} — ₹${item.price}</li>`
      )
      .join("");

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
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
            ? `<img src="${order.paymentScreenshot}" width="300"/>`
            : ""
        }
      `,
    });

    console.log("✅ Admin email sent via Brevo");
  } catch (err) {
    console.error("❌ Admin email send failed:", err.message);
  }
};
