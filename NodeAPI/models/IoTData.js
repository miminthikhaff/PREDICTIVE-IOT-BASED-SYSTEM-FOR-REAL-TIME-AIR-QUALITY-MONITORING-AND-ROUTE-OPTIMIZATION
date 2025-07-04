const mongoose = require("mongoose");

const IoTDataSchema = new mongoose.Schema({
  iotDeviceId: String,
  gpsLatitude: Number,
  gpsLongitude: Number,
  co2Level: Number,
  no2Level: Number,
  ch4Level: Number,
  timestamp: { type: Date, default: Date.now }, // Automatically capture the save timestamp
});

module.exports = mongoose.model("IoTData", IoTDataSchema);
