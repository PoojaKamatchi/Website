// seedAdmin.js
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();
await connectDB();

const run = async () => {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const exists = await User.findOne({ email });
  if (exists) {
    console.log("Admin already exists:", email);
    process.exit();
  }
  const user = new User({ name: "Admin", email, password: process.env.ADMIN_PASSWORD || "admin123", role: "admin" });
  await user.save();
  console.log("Admin created:", email);
  process.exit();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
 