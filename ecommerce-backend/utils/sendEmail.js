import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const sendEmail = async ({ to, subject, otp, userName }) => {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    await apiInstance.sendTransacEmail({
      sender: {
        email: process.env.EMAIL_FROM,
        name: "Life Gain",
      },
      to: [
        {
          email: to,
          name: userName,
        },
      ],
      subject: subject,

      // 🔥 THIS IS THE FIX
      htmlContent: `
        <html>
          <body>
            <h2>Hello ${userName}</h2>
            <p>Your OTP is:</p>
            <h1 style="color:#2563eb;">${otp}</h1>
            <p>This OTP is valid for 10 minutes.</p>
            <br/>
            <p>— Life Gain Team</p>
          </body>
        </html>
      `,
    });

    console.log("✅ OTP email sent successfully");
    return true;
  } catch (error) {
    console.error(
      "❌ Email failed:",
      error.response?.body || error.message
    );
    return false;
  }
};

export default sendEmail;
