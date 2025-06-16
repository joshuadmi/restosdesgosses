// controllers/reviewController.js
import Review from "../models/Review.js";
import Restaurant from "../models/Restaurant.js";
import mongoose from "mongoose";

/**
 * Ajoute un avis à un restaurant.
 * POST /api/reviews/:restaurantId
 */
// Ici, on lirait req.params.restaurantId et req.body (note, commentaire…)
export async function addReview(req, res) {
  try {
    const { restaurantId } = req.params;
    const { note, commentaire } = req.body;

    // Vérifier que le restaurant existe
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant non trouvé" });
    }

    // créer l'avis
    const review = new Review({
      auteur: req.user._id, // récupère l'ID de l'utilisateur connecté
      restaurant: restaurantId,
      note,
      commentaire,
    });


    const savedReview = await review.save();

    console.log("Type restaurantId param:", typeof restaurantId, restaurantId);
    console.log("Premier review trouvé pour ce resto:", await Review.findOne({ restaurant: new mongoose.Types.ObjectId(restaurantId) }));
    
    // Mettre à jour la note moyenne du restaurant ici
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

    console.log("Stats:", stats);

    const averageRating = stats.length > 0 ? stats[0].averageRating : 0;
    const totalReviews = stats.length > 0 ? stats[0].totalReviews : 0;



    // Mets à jour les champs dans le resto (optionnel mais pro)
    restaurant.noteMoyenne = averageRating;
    restaurant.nombreAvis = totalReviews;
    await restaurant.save();

    res.status(201).json({
      message: "Avis ajouté avec succès",
      review: savedReview,
      averageRating,
      totalReviews,
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
      await recalculeNoteRestaurant(review.restaurant);
  
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
      await recalculeNoteRestaurant(restaurantId);
  
      res.json({ message: "Avis supprimé" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
