// server.js (version moderne)
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import restaurantRoutes from "./routes/restaurants.js";
import reviewRoutes from "./routes/reviews.js";

const app = express();

dotenv.config();

// Connexion à la base de données
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` 🚲 Le serveur tourne sur le port ${PORT}`));

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/restaurants/tags", restaurantRoutes);

app.get("/", (req, res) => {
  res.send("Bienvenue sur Les Restos des Gosses !");
});
