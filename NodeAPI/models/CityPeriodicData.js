const mongoose = require("mongoose");

const CityPeriodicDataSchema = new mongoose.Schema({
  iotDeviceId: String,
  city: String,
  gpsLatitude: Number,
  gpsLongitude: Number,
  co2Level: Number,
  no2Level: Number,
  so2Level: Number,
  ch4Level: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CityPeriodicData", CityPeriodicDataSchema);
