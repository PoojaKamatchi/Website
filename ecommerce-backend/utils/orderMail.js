import SibApiV3Sdk from "sib-api-v3-sdk";

/* ================= BREVO SETUP ================= */
const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

/* ================= ORDER MAIL ================= */
export const sendOrderNotification = async (order) => {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const itemsHtml = order.orderItems
      .map(
        (item) =>
          `<li>${item.name} × ${item.quantity} — ₹${item.price}</li>`
      )
      .join("");

    await apiInstance.sendTransacEmail({
      sender: {
        email: process.env.EMAIL_FROM,
        name: "Life Gain",
      },
      to: [
        {
          email: process.env.ADMIN_EMAIL,
          name: "Admin",
        },
      ],
      subject: "🛒 New Order Received",
      htmlContent: `
        <h2>🛍️ New Order Received</h2>
        <p><b>Name:</b> ${order.name}</p>
        <p><b>Mobile:</b> ${order.mobile}</p>
        <p><b>Address:</b> ${order.shippingAddress}</p>

        <h3>Order Items</h3>
        <ul>${itemsHtml}</ul>

        <h3>Total Amount: ₹${order.totalAmount}</h3>

        ${
          order.paymentScreenshot
            ? `<p><b>Payment Screenshot:</b></p>
               <img src="${order.paymentScreenshot}" width="300"/>`
            : "<p><b>Payment:</b> Cash on Delivery</p>"
        }
      `,
    });

    console.log("✅ Admin order email sent successfully");
  } catch (error) {
    console.error(
      "❌ Admin order email failed:",
      error.response?.text || error.message
    );
  }
};
