// backend/seedProducts.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const products = [
  {
    name: "Product 1",
    description: "This is Product 1",
    price: 200,
    image: "https://via.placeholder.com/150",
  },
  {
    name: "Product 2",
    description: "This is Product 2",
    price: 350,
    image: "https://via.placeholder.com/150",
  },
  {
    name: "Product 3",
    description: "This is Product 3",
    price: 500,
    image: "https://via.placeholder.com/150",
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");

    // Remove old products first
    await Product.deleteMany();
    console.log("Old products removed");

    // Insert new products
    const created = await Product.insertMany(products);
    console.log("Products added:", created);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedProducts();
