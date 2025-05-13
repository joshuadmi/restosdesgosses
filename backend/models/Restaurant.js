import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    adresse: { type: String, required: true },
    ville: { type: String, required: true },
    auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tagsKidsFriendly: [{
      type: String,
      enum: [
        'chaise haute',
        'menu enfant',
        'espace jeux',
        'coin coloriage',
        'micro-ondes',
        'table à langer',
        'autre',
      ]
    }],
    description: { type: String },
    noteMoyenne: { type: Number, default: 0 },
    nombreAvis: { type: Number, default: 0 },
    estRevendique: { type: Boolean, default: false },
    restaurateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;
