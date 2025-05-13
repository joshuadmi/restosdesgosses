import mongoose from 'mongoose';

const claimRequestSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    demandeur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, default: '' },
    statut: {
      type: String,
      enum: ['en attente', 'acceptée', 'refusée'],
      default: 'en attente',
    },
    traitePar: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    dateDemande: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ClaimRequest = mongoose.model('ClaimRequest', claimRequestSchema);
export default ClaimRequest;
