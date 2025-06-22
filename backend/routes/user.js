import express from "express";
import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { updateMe, deleteMe, getMe, updatePassword } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protect, getMe);         // Afficher son profil
router.put("/me", protect, updateMe);      // Modifier ses infos
router.patch("/me/password", protect, updatePassword); // Changer le mot de passe
router.delete("/me", protect, deleteMe);   // Supprimer son compte

export default router;
