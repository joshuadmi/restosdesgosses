// controllers/reviewController.js
import Review from "../models/Review.js";
import Restaurant from "../models/Restaurant.js";
import mongoose from "mongoose";

// Fonction utilitaire pour recalculer la note moyenne
async function recalculateRestaurantGrade(restaurantId) {
  const stats = await Review.aggregate([
    { $match: { restaurant: new mongoose.Types.ObjectId(restaurantId) } },
    {
      $group: {
        _id: "$restaurant",
        averageRating: { $avg: "$note" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);
  const averageRating = stats.length > 0 ? stats[0].averageRating : 0;
  const totalReviews = stats.length > 0 ? stats[0].totalReviews : 0;
  await Restaurant.findByIdAndUpdate(restaurantId, {
    noteMoyenne: averageRating,
    nombreAvis: totalReviews,
  });
}

/**
 * Ajoute un avis à un restaurant.
 * POST /api/reviews/:restaurantId
 */
// Ici, on lirait req.params.restaurantId et req.body (note, commentaire…)
export async function addReview(req, res) {
  try {
    const { restaurantId } = req.params;
    const { note, commentaire } = req.body;

    // Avant de créer le nouvel avis :
const existing = await Review.findOne({
  auteur: req.user._id,
  restaurant: restaurantId,
});
if (existing) {
  return res.status(400).json({ message: "Vous avez déjà noté ce restaurant. Modifiez votre avis si besoin !" });
}

// ... ensuite seulement, tu crées l'avis !


    // Vérifier que le restaurant existe
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant non trouvé" });
    }

    // Créer l'avis
    const review = new Review({
      auteur: req.user._id,
      restaurant: restaurantId,
      note,
      commentaire,
    });

    const savedReview = await review.save();

    // Appelle la fonction utilitaire
    await recalculateRestaurantGrade(restaurantId);

    res.status(201).json({
      message: "Avis ajouté avec succès",
      review: savedReview,
      // Pas besoin d'envoyer averageRating ici sauf si tu veux l'afficher instantanément côté front
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

/**
 * Récupère tous les avis d’un restaurant.
 * GET /api/reviews/:restaurantId
 */
// Ici, on ferait Review.find({ restaurant: req.params.restaurantId })
export async function getReviews(req, res) {
  try {
    const { restaurantId } = req.params;
    const reviews = await Review.find({ restaurant: restaurantId })
      .populate("auteur", "nom prenom") // On peut peupler l'auteur avec son nom et prénom
      .sort({ date: -1 }); // Trier par date décroissante

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

// MODIFIER un avis (PUT /api/reviews/edit/:reviewId)
export async function updateReview(req, res) {
  try {
    const { reviewId } = req.params;
    const { note, commentaire } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Avis non trouvé" });

    // Vérifie que c'est bien l'auteur
    if (review.auteur.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Non autorisé" });

    // Modifie les champs autorisés
    if (note !== undefined) review.note = note;
    if (commentaire !== undefined) review.commentaire = commentaire;

    await review.save();

    // Recalcule la note moyenne du restaurant
    await recalculateRestaurantGrade(review.restaurant);

    res.json({ message: "Avis modifié", review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

// SUPPRIMER un avis (DELETE /api/reviews/delete/:reviewId)
export async function deleteReview(req, res) {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Avis non trouvé" });

    // Vérifie que c'est bien l'auteur
    if (review.auteur.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Non autorisé" });

    const restaurantId = review.restaurant;
    await review.deleteOne();

    // Recalcule la note moyenne du restaurant
    await recalculateRestaurantGrade(restaurantId);

    res.json({ message: "Avis supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
