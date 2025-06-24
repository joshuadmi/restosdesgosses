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

import { protect, adminCheck } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getAllRestaurants);

// route pour récupérer les tags du tableau
router.get("/tags", (req, res) => {
  res.json(TAGS_KIDS);
});
router.get("/:id", getRestaurantById);
router.post("/", protect, createRestaurant);

// mettre à jour seulement une partie du resto: patch (pour les petites modifs)
router.patch("/:id/valider", protect, adminCheck, validerRestaurant);
router.put("/:id", protect, updateRestaurant);
router.delete("/:id", protect, adminCheck, deleteRestaurant);



export default router;
