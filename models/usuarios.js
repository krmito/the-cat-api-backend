const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida']
  }
}, {
  timestamps: true
});

usuarioSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

module.exports = mongoose.model('Usuario', usuarioSchema);
