import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { updateMe, deleteMe, getMe, updatePassword } from "../controllers/userController.js";

const router = express.Router();

// me = le user connecte 
router.get("/me", protect, getMe);         
router.put("/me", protect, updateMe);      
router.patch("/me/password", protect, updatePassword); 
router.delete("/me", protect, deleteMe);   

export default router;
