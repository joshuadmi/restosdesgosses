import Restaurant from "../models/Restaurant.js";
import Review from "../models/Review.js";

// filtrage restos
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
      auteur: req.user._id,
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

    await Review.deleteMany({ restaurant: req.params.id });

    res.json({ message: "Restaurant supprimé" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
