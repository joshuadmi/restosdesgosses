import Review from "../models/Review.js";
import Restaurant from "../models/Restaurant.js";

async function recalculateRestaurantGrade(restaurantId) {
  const reviews = await Review.find({ restaurant: restaurantId });

  let averageRating = 0;
  if (reviews.length > 0) {
    const total = reviews.reduce((acc, review) => acc + review.note, 0);
    averageRating = total / reviews.length;
  }

  const totalReviews = reviews.length;

  await Restaurant.findByIdAndUpdate(restaurantId, {
    noteMoyenne: averageRating,
    nombreAvis: totalReviews,
  });
}

export async function addReview(req, res) {
  try {
    const { restaurantId } = req.params;
    const { note, commentaire } = req.body;

    const existing = await Review.findOne({
      auteur: req.user._id,
      restaurant: restaurantId,
    });
    if (existing) {
      return res.status(400).json({
        message:
          "Vous avez déjà noté ce restaurant. Modifiez votre avis si besoin !",
      });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant non trouvé" });
    }

    const review = new Review({
      auteur: req.user._id,
      restaurant: restaurantId,
      note,
      commentaire,
    });

    const savedReview = await review.save();

    await recalculateRestaurantGrade(restaurantId);

    res.status(201).json({
      message: "Avis ajouté avec succès",
      review: savedReview,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function getReviews(req, res) {
  try {
    const { restaurantId } = req.params;
    const reviews = await Review.find({ restaurant: restaurantId })
      .populate("auteur", "nom prenom")
      .sort({ date: -1 });

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function updateReview(req, res) {
  try {
    const { reviewId } = req.params;
    const { note, commentaire } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Avis non trouvé" });

    if (review.auteur.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Non autorisé" });

    if (note !== undefined) review.note = note;
    if (commentaire !== undefined) review.commentaire = commentaire;

    await review.save();

    await recalculateRestaurantGrade(review.restaurant);

    res.json({ message: "Avis modifié", review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function deleteReview(req, res) {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Avis non trouvé" });

    if (review.auteur.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Non autorisé" });

    const restaurantId = review.restaurant;
    await review.deleteOne();

    await recalculateRestaurantGrade(restaurantId);

    res.json({ message: "Avis supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
