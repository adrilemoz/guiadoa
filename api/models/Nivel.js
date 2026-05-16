import mongoose from 'mongoose';

const NivelSchema = new mongoose.Schema({
  nivel:        { type: Number, required: true, unique: true, min: 1 },
  xp:           { type: Number, default: null },   // null = desconhecido
  atualizadoEm: { type: Date,   default: Date.now },
}, { collection: 'doa_niveis' });

NivelSchema.index({ nivel: 1 });

export default mongoose.model('Nivel', NivelSchema);
