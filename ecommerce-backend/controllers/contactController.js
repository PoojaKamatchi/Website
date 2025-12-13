import Contact from "../models/contactModel.js";

// Admin: Save or Update Contact Info
export const saveContact = async (req, res) => {
  try {
    let info = await Contact.findOne();

    if (info) {
      // Update existing record
      info = await Contact.findOneAndUpdate({}, req.body, { new: true });
    } else {
      // Create new record
      info = await Contact.create(req.body);
    }

    res.json(info);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save contact info" });
  }
};

// User: Fetch Contact Info
export const getContact = async (req, res) => {
  try {
    const info = await Contact.findOne();
    res.json(info);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch contact info" });
  }
};
