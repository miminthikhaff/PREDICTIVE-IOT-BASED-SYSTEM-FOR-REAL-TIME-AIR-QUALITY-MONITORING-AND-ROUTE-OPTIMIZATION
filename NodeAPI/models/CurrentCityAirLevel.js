const mongoose = require("mongoose");

const CurrentCityAirLevelSchema = new mongoose.Schema({
  city: { type: String, unique: true },
  gpsLatitude: Number,
  gpsLongitude: Number,
  averageCO2Level: Number,
  averageNO2Level: Number,
  averageCH4Level: Number,

  timestamp: { type: Date, default: Date.now },
});
module.exports = mongoose.model(
  "CurrentCityAirLevel",
  CurrentCityAirLevelSchema
);
