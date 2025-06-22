// routes/auth.js
import verifyCaptcha from "../middleware/verifyCaptcha.js"; 
import { Router } from "express";
import {
  validateRegisterUser,
  validateLoginUser,
} from "../middleware/authValidation.js";
import validateRequest from "../middleware/validateRequest.js";
import { register, login } from "../controllers/authController.js";

const router = Router();

router.post("/register", verifyCaptcha, validateRegisterUser, validateRequest, register);
router.post("/login", validateLoginUser, validateRequest, login);
// juste pour tester qu’il monte correctement
router.get("/", (req, res) => {
  res.json({ message: "Auth route OK" });
});



export default router;
