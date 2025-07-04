const mongoose = require("mongoose");

const CO2AllPredictionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  startDate: String, // YYYY-MM-DD format
  endDate: String, // YYYY-MM-DD format
  timeStamps: [String], // Array of timestamps (e.g., "2023-08-20T00:00:00")
  co2Levels: [Number], // Array of CO2 levels corresponding to the timestamps
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CO2AllPrediction", CO2AllPredictionSchema);
