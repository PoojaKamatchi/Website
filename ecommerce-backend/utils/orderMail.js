import nodemailer from "nodemailer";

export const sendOrderNotification = async (order) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE, // e.g., "gmail"
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const itemsHtml = order.orderItems
      .map((i) => `<li>${i.name} × ${i.quantity} — ₹${i.price}</li>`)
      .join("");

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Order - ${order._id}`,
      html: `
        <h2>New Order Received</h2>
        <p><b>Name:</b> ${order.name}</p>
        <p><b>Mobile:</b> ${order.mobile}</p>
        <p><b>Address:</b> ${order.shippingAddress}</p>
        <ul>${itemsHtml}</ul>
        <h3>Total: ₹${order.totalAmount}</h3>
        ${
          order.paymentScreenshot
            ? `<p><b>Payment Screenshot:</b></p>
               <img src="${order.paymentScreenshot}" alt="Payment Screenshot" width="300"/>`
            : ""
        }
      `,
    });

    console.log("✅ Order notification sent!");
  } catch (err) {
    console.error("Mail error:", err.message);
  }
};
