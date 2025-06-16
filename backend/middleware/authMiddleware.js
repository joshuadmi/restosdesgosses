// middleware/authMiddleware.js

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
    req.user = user;      // on stocke le user dans la requête
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Token invalide' });
  }
};
