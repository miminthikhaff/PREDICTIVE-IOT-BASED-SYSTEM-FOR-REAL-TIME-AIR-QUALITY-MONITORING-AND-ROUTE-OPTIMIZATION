const mongoose = require("mongoose");

const CurrentCityAirLevelHistorySchema = new mongoose.Schema({
  city: { type: String },
  gpsLatitude: Number,
  gpsLongitude: Number,
  averageCO2Level: Number,
  averageNO2Level: Number,
  averageCH4Level: Number,
  copdStat: Boolean,
  asthmaStat: Boolean,
  bronchitisStat: Boolean,
  lungCancerStat: Boolean,
  heartDiseaseStat: Boolean,

  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
  "CurrentCityAirLevelHistoryNew3",
  CurrentCityAirLevelHistorySchema
);
