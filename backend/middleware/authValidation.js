import { body } from 'express-validator';

export const validateRegisterUser = [
  body("nom")
    .trim()
    .notEmpty()
    .withMessage("Le nom est obligatoire")
    .isLength({ min: 3, max: 20 })
    .withMessage("Le nom doit avoir entre 3 et 20 caractères"),
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
    .isLength({ min: 4, max: 20 })
    .withMessage("Le mot de passe doit contenir entre 4 et 20 caractères"),
];

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
