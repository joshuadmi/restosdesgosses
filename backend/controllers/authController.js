import User from "../models/User.js";
import jwt from "jsonwebtoken";


// focntion pour créer un utilisateur 
export async function register(req, res) {
  const { nom, email, motDePasse } = req.body;
  try {


    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }
    const user = new User({ nom, email, motDePasse });
    await user.save();

    // jwt ici
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

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

// pour le login
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
