// server.js (version moderne)
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import restaurantRoutes from './routes/restaurants.js';
// tu ajoutes ici d’autres routes...

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);

app.get('/', (req, res) => {
  res.send('Bienvenue sur Les Restos des Gosses !');
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () =>
      console.log('🚀 Backend démarré sur le port 5000')
    );
  })
  .catch((err) => console.error(err));
