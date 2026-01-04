import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "../models/adminModel.js";

dotenv.config();

const createAdmin = async () => {
  try {
    console.log("🔹 Connecting to DB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ DB Connected");

    console.log("🔹 Checking existing admin...");
    const existingAdmin = await Admin.findOne({
      email: "lifegain265@gmail.com",
    });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists");
      process.exit();
    }

    console.log("🔹 Hashing password...");
    const hashedPassword = await bcrypt.hash("lifegain33", 10);
    console.log("✅ Password hashed");

    console.log("🔹 Creating admin...");
    await Admin.create({
      name: "Pooja",
      email: "lifegain265@gmail.com",
      password: hashedPassword,
    });

    console.log("✅ Admin created successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
