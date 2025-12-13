import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  title: String,
  description: String,
  address: String,
  phone: String,
  email: String,
  timings: String,
  whatsapp: String,
  emergency: String,
  services: [String], // Array of services
});

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
