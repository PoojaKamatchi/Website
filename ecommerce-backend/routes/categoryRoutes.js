// backend/routes/categoryRoutes.js
import express from "express";
import { getPublicCategories } from "../controllers/categoryController.js";

const router = express.Router();

// ✅ Public route – for customer site (no auth required)
router.get("/", getPublicCategories);

export default router;
