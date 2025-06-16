// controllers/authController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";

/**
 * POST /api/auth/register
 * Crée un nouvel utilisateur et renvoie un token + son ID.
 */
export async function register(req, res) {
  const { nom, email, motDePasse } = req.body;
  try {
    // 1. Vérifier qu’on n’a pas déjà un user avec ce mail
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }
    // 2. Créer et hacher le mot de passe (pre-save hook)
    const user = new User({ nom, email, motDePasse });
    await user.save();

    // 3. Générer un JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 4. Répondre avec le token et l’ID
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        nom: user.nom,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

/**
 * POST /api/auth/login
 * Vérifie les identifiants et renvoie un token + l’ID.
 */
export async function login(req, res) {
  const { email, motDePasse } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Identifiants invalides" });
    }
    const isMatch = await user.comparePassword(motDePasse);
    if (!isMatch) {
      return res.status(400).json({ error: "Identifiants invalides" });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
res.json({
  token,
  user: {
    _id: user._id,
    nom: user.nom,
    email: user.email,
    role: user.role,
  },
});  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
