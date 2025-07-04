const mongoose = require('mongoose');

const PMPredictionDataSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    city: String,
    latitude: Number,
    longitude: Number,
    inputs: {
        no2: [Number],
        so2: [Number],
        o3: [Number],
        co: [Number]
    },
    prediction: {
        pm_2_5: [Number],
        pm_10: [Number]
    },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PMPredictionData', PMPredictionDataSchema);
