import nodemailer from "nodemailer";

export const sendOrderNotification = async (order) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE, // Gmail, outlook, etc.
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const itemsList = order.orderItems
      .map(
        (item) =>
          `<li>${item.name} × ${item.quantity} — ₹${item.price}</li>`
      )
      .join("");

    const htmlContent = `
      <h2>📦 New Order Received</h2>
      <p><b>Order ID:</b> ${order._id}</p>
      <p><b>Name:</b> ${order.name}</p>
      <p><b>Mobile:</b> ${order.mobile}</p>
      <p><b>Address:</b> ${order.shippingAddress}</p>
      <p><b>Payment:</b> ${order.paymentMethod}</p>

      <h3>Items:</h3>
      <ul>${itemsList}</ul>

      <h3>Total Amount: ₹${order.totalAmount}</h3>
      <p>Shipping Charge: ₹${order.shippingCharge}</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL, // Your client email
      subject: `New Order Received - ${order._id}`,
      html: htmlContent,
    });

    console.log("📩 Order Email Sent Successfully");
  } catch (error) {
    console.log("❌ Error sending email:", error.message);
  }
};
