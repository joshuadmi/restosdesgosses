// middleware/validateRequest.js

import { validationResult } from "express-validator";

/**
 * Middleware générique pour gérer les erreurs de validation express-validator
 */
const validateRequest = (req, res, next) => {
    
    console.log("validateRequest appelé");

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // On retourne un tableau d'erreurs formaté (code 400)
    return res.status(400).json({ errors: errors.array() });
  }

  // Si pas d'erreur, on passe au middleware suivant
  next();
};

export default validateRequest;
