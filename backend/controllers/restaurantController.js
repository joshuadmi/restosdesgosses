// controllers/restaurantController.js

import Restaurant from "../models/Restaurant.js";

// récupération des restos avec filtrage
export async function getAllRestaurants(req, res) {
  try {
    const filtre = {};
    if (req.query.valideAdmin === "false") {
      filtre.valideAdmin = false;
    }
    const restaurants = await Restaurant.find(filtre);
    res.json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function getRestaurantById(req, res) {
  try {
    const resto = await Restaurant.findById(req.params.id);
    if (!resto) {
      return res.status(404).json({ message: "Restaurant non trouvé" });
    }
    res.json(resto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function createRestaurant(req, res) {
  try {
    const data = {
      ...req.body,
      auteur: req.user._id, // on récupère l'ID de l'utilisateur connecté
    };
    const newRestaurant = new Restaurant(data);
    const savedRestaurant = await newRestaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Données invalides" });
  }
}

export async function validerRestaurant(req, res) {
  try {
    // Tu peux vérifier ici le rôle de l'utilisateur (optionnel)
    const resto = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { valideAdmin: true },
      { new: true }
    );
    if (!resto) {
      return res.status(404).json({ message: "Resto non trouvé" });
    }
    res.json(resto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function proposedUpdate(req, res) {
  try {
    const { nom, adresse, description, horaires, commentaire } = req.body;

    // Stocke uniquement ce qui est proposé (tu peux améliorer avec un diff plus fin si tu veux)
    const modif = { nom, adresse, description, horaires };

    await ProposedUpdate.create({
      restaurant: req.params.id,
      utilisateur: req.user._id,
      modification: modif,
      commentaire,
      statut: "en attente",
    });

    res.json({ message: "Suggestion enregistrée" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function updateRestaurant(req, res) {
  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { ...req.body, valideAdmin: false },
      { new: true }
    );
    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Restaurant non trouvé" });
    }
    res.json(updatedRestaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function deleteRestaurant(req, res) {
  try {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deletedRestaurant) {
      return res.status(404).json({ message: "Restaurant non trouvé" });
    }
    res.json({ message: "Restaurant supprimé" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
