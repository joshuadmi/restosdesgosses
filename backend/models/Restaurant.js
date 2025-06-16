import mongoose from "mongoose";

// Liste des tags pour les restaurants kids-friendly. LEs modifications sont faites ici
export const TAGS_KIDS = [
  "chaise haute",
  "menu enfant",
  "espace jeux",
  "coin coloriage",
  "micro-ondes",
  "table à langer",
  "autre",
];
const restaurantSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    adresse: { type: String, required: true },
    ville: { type: String, required: true },
    postalCode: { type: String, required: true },
    auteur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tagsKidsFriendly: [
      {
        type: String,
        enum: TAGS_KIDS,
      },
    ],
    horaires: { type: String },
    siteweb: { type: String },
    telephone: { type: String },
    prixMoyen: { type: Number },

    images: [{ type: String }],
    description: { type: String },
    noteMoyenne: { type: Number, default: 0 },
    nombreAvis: { type: Number, default: 0 },
    valideAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;
