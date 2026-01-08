import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const sendEmail = async ({ to, subject, htmlContent, name }) => {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    await apiInstance.sendTransacEmail({
      sender: {
        email: process.env.EMAIL_FROM,
        name: "Life Gain",
      },
      to: [{ email: to, name }],
      subject,
      htmlContent,
    });

    console.log("✅ Email sent to", to);
    return true;
  } catch (err) {
    console.error("❌ Email failed:", err.response?.text || err.message);
    return false;
  }
};

export default sendEmail;
