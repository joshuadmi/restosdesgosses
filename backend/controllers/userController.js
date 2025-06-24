
import User from "../models/User.js";
import Review from "../models/Review.js";


export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-motDePasse");
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération du profil" });
  }
};

export const updateMe = async (req, res) => {
    const { nom, email } = req.body;
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { nom, email },
        { new: true, runValidators: true }
      ).select("-motDePasse");
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la mise à jour du profil" });
    }
  };
  
  import bcrypt from "bcrypt";

export const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    const isMatch = await bcrypt.compare(oldPassword, user.motDePasse);
    if (!isMatch) {
      return res.status(400).json({ error: "Ancien mot de passe incorrect" });
    }

    
    user.motDePasse = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Mot de passe mis à jour !" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du changement du mot de passe" });
  }
};

export const deleteMe = async (req, res) => {
    try {
        await Review.deleteMany({ auteur: req.user._id }); 

      await User.findByIdAndDelete(req.user._id);
      res.json({ message: "Compte supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la suppression du compte" });
    }
  };

  