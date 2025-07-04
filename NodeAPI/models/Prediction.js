const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  prophetPrediction: [{ stock: String, predictedPrice: [Number] }],
  arimaPrediction: [{ stock: String, prediction: [Number] }],
  //bitcoinPredictionArima: [Number],
 // bitcoinPredictionProphet: [Number],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prediction', PredictionSchema);
