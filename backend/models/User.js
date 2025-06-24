import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    motDePasse: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'super-user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// mot de passe
userSchema.pre('save', async function (next) {
  if (!this.isModified('motDePasse')) return next();
  const salt = await bcrypt.genSalt(10);
  this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
  next();
});
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.motDePasse);
};

const User = mongoose.model('User', userSchema);
export default User;