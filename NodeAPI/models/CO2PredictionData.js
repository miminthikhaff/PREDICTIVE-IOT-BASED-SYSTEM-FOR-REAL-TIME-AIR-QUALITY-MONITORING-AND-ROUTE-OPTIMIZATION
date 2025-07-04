const mongoose = require('mongoose');

const PredictionDataSchema = new mongoose.Schema({
    
    day: String, // YYYY-MM-DD format
    hour: Number, // hour of the day
    co2Level: Number
});

module.exports = mongoose.model('PredictionData', PredictionDataSchema);
