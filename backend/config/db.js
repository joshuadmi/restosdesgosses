// backend/config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("MongoDB connecté");
  } catch (error) {
    console.error("Erreur de connexion à MongoDB :", error.message);

    process.exit(1); // stoppe le process en cas d’échec
  }
};

export default connectDB;
