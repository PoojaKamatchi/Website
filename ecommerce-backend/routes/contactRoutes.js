import express from "express";
import { saveContact, getContact } from "../controllers/contactController.js";

const router = express.Router();

// Admin panel route (save/update)
router.post("/admin/contact", saveContact);  // Admin can POST new info
router.put("/admin/contact", saveContact);   // Admin can PUT updated info

// User route (fetch contact info)
router.get("/contact", getContact);

export default router;
