const CurrentCityAirLevel = require("../models/CurrentCityAirLevel");
const CurrentCityAirLevelHistory = require("../models/CurrentCityAirLevelHistory");
const IotData = require("../models/IoTData");
const axios = require("axios");
require("dotenv").config();

// Save new stock prediction data

// Retrieve all predictions
exports.getAllCityAirLevels = async (req, res) => {
  try {
    const predictions = await CurrentCityAirLevel.find().sort({
      timestamp: -1,
    });
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getActiveCityAirLevels = async (req, res) => {
  try {
    const timeThreshold = new Date(new Date() - 10 * 60 * 1000);
    const predictions = await CurrentCityAirLevel.find({
      timestamp: { $gte: timeThreshold },
    })
      .sort({ timestamp: -1 })
      .exec();
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAirLevelsByCity = async (req, res) => {
  const city = req.params.city;
  try {
    const predictions = await CurrentCityAirLevel.find({ city })
      .sort({ timestamp: -1 })
      .exec();
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAirLevelsHistoryByCity = async (req, res) => {
  const city = req.params.city;
  try {
    const predictions = await CurrentCityAirLevelHistory.find({ city })
      .sort({ timestamp: -1 }) // Sort by timestamp in descending order
      .limit(20) // Limit to the last 20 records
      .exec();
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get last 20 IoT data records by device ID
exports.getIoTDataById = async (req, res) => {
  const iotDeviceId = req.params.id;
  try {
    const data = await IotData.find({ iotDeviceId })
      .sort({ timestamp: -1 }) // Sort by timestamp in descending order
      .limit(20) // Limit to the last 20 records
      .exec();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
