
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant' });
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-motDePasse');
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur invalide' });
    }
    req.user = user;      
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Token invalide' });
  }
};


export const adminCheck = async (req, res, next) => {
  try {
      if(req.user.role === "admin" || req.user.role === "super-user"){
          next();
      }else{
        return res.status(401).json({ message: `Vous n'êtes pas admin` })  
      }
  } catch (error) {
      res.status(500).json({ message: `Erreur d'authentification admin` });
  }
};