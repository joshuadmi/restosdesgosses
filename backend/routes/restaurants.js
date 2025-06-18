// routes/restaurants.js
import { Router } from "express";
import {
  
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  validerRestaurant,
} from "../controllers/restaurantController.js";
import { TAGS_KIDS } from "../models/Restaurant.js";


import { protect , adminCheck } from "../middleware/authMiddleware.js";


const router = Router();

// 1. Récupérer la liste des restos
router.get("/", getAllRestaurants);


// Liste des tags pour les enfants
router.get("/tags", (req, res) => {
  res.json(TAGS_KIDS);
});

router.get("/:id", getRestaurantById);



// 2. Créer un nouveau resto
router.post("/", protect, createRestaurant);

// mettre à jour seulement une partie du resto: patch (petites modifs)

router.patch("/:id/valider", protect, adminCheck, validerRestaurant);



// 3. Modifier un resto existant
router.put("/:id", protect, updateRestaurant);

// 4. Supprimer un resto
router.delete("/:id", protect, adminCheck, deleteRestaurant);

export default router;
