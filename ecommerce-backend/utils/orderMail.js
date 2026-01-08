import nodemailer from "nodemailer";

export const sendOrderNotification = async (order) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const items = order.orderItems
      .map(
        (i) => `<li>${i.name} × ${i.quantity} — ₹${i.price}</li>`
      )
      .join("");

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: "🛒 New Order Received",
      html: `
        <h2>New Order</h2>
        <p><b>Name:</b> ${order.name}</p>
        <p><b>Mobile:</b> ${order.mobile}</p>
        <p><b>Address:</b> ${order.shippingAddress}</p>
        <ul>${items}</ul>
        <h3>Total: ₹${order.totalAmount}</h3>
      `,
    });

    console.log("✅ Admin order email sent");
  } catch (err) {
    console.error("❌ Order email failed:", err.message);
  }
};
