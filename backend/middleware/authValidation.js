// backend/middleware/authValidation.js
import { body } from 'express-validator';

// Validation pour l'inscription
export const validateRegisterUser = [
  body("nom")
    .trim()
    .notEmpty()
    .withMessage("Le nom est obligatoire")
    .isLength({ min: 3, max: 10 })
    .withMessage("Le nom doit avoir entre 3 et 10 caractères"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("L'email est obligatoire")
    .isEmail()
    .withMessage("Email invalide"),
  body("motDePasse")
    .trim()
    .notEmpty()
    .withMessage("Mot de passe manquant")
    .isLength({ min: 8, max: 200 })
    .withMessage("Le mot de passe doit contenir entre 8 et 200 caractères"),
];

// Validation pour la connexion
export const validateLoginUser = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("L'email est obligatoire")
    .isEmail()
    .withMessage("Email invalide"),
  body("motDePasse")
    .trim()
    .notEmpty()
    .withMessage("Mot de passe manquant"),
];
