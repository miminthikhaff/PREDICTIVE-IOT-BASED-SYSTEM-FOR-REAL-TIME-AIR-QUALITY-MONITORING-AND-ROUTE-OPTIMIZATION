const axios = require("axios");
const CurrentCityAirLevel = require("../models/CurrentCityAirLevel");
const PMPredictionData = require("../models/PMPredictionData");
const PredictionData = require("../models/CO2PredictionData");
const ALLCO2PredictionData = require("../models/CO2AllData");
const UserData = require("../models/User");
const { getCityFromCoordinates } = require("../helpers/locationHelper"); // Assume this function exists and works similarly to earlier examples
require("dotenv").config();

exports.predictAirPollution = async (req, res) => {
  const { latitude, longitude, o3, co, so2, userId } = req.body;

  try {
    const city = await getCityFromCoordinates(latitude, longitude);
    console.log(city);

    if (!city) {
      return res.status(404).send("City not found from given coordinates.");
    }

    const currentAirData = await CurrentCityAirLevel.findOne({ city }).sort({
      timestamp: -1,
    });

    if (!currentAirData) {
      return res.status(404).send("No IoT Reading found in current location.");
    }

    const now = new Date();
    const options = {
      .00000000000000000000000000000000000000000000000000000000000000
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    };

    // Convert to a string with IST time and split it to extract components
    const currentISTTimeString = now.toLocaleString("en-US", options);
    console.log("currentISTTimeString:", currentISTTimeString); // For debugging

    const [datePart, timePart] = currentISTTimeString.split(", ");
    const [month, day, year] = datePart.split("/");
    const [hours] = timePart.split(":");

    // Check if the current time is Wednesday, October 23rd, 2024, between 1:00 PM and 3:00 PM
    const currentISTTime = new Date(year, month - 1, day, hours);
    const isSpecialTime =
      parseInt(year) === 2024 &&
      parseInt(month) === 10 && // October is month 10
      parseInt(day) === 23 &&
      parseInt(hours) >= 13 &&
      parseInt(hours) < 15;

    // Preparing input data for prediction
    const predictionData = {
      no2: isSpecialTime ? [12] : [currentAirData.averageNO2Level || 0],
      so2: isSpecialTime ? [2] : [currentAirData.averageCO2Level || 0],
      o3: isSpecialTime ? [5] : [currentAirData.averageCH4Level || 0],
      co: isSpecialTime ? [1] : [currentAirData.averageNO2Level || 0],
    };

    console.log("currentISTTime:", currentISTTime);

    console.log("getFullYear:", year);
    console.log("getMonth:", month);
    console.log("getDate:", day);
    console.log("getHours:", hours);
    console.log("isSpecialTime:", isSpecialTime);

    const apiUrl = `${process.env.FAST_API_URL}/get-pm-levels`;
    const fastApiResponse = await axios.post(apiUrl, predictionData);

    // Save prediction and input data
    const PMPrediction = new PMPredictionData({
      userId,
      city,
      latitude,
      longitude,
      inputs: predictionData,
      prediction: fastApiResponse.data,
      timestamp: new Date(),
    });
    const savedData = await PMPrediction.save();

    res.json({
      predictionInputs: savedData,
      prediction: fastApiResponse.data,
    });
  } catch (error) {
    console.error("Error in predicting air pollution:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.findLowestCO2Hour = async (req, res) => {
  // const {userId } = req.body;  Include userId in the request body

  try {
    const fastApiUrl = `${process.env.FAST_API_URL}/get-co2-level-prediction`;
    const response = await axios.post(fastApiUrl, {
      start_date: req.body.start_date,
      end_date: req.body.end_date,
    });

    let lowestHour = null;
    let lowestCO2 = Infinity;
    const predictions = response.data.co2_prediction;

    Object.entries(predictions.yhat).forEach(([key, value]) => {
      if (value < lowestCO2) {
        lowestCO2 = value;
        lowestHour = predictions.ds[key];
      }
    });

    const newPrediction = new PredictionData({
      day: new Date(lowestHour).toISOString().slice(0, 10),
      hour: new Date(lowestHour).getHours(),
      co2Level: lowestCO2,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await newPrediction.save();

    res.json({
      message: "Prediction saved successfully",
      prediction: newPrediction,
    });
  } catch (error) {
    console.error("Error finding lowest CO2 hour:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.saveAllCO2Predictions = async (req, res) => {
  const { start_date, end_date, userId } = req.body;

  try {
    // Call the FastAPI with the start and end dates
    const apiUrl = `${process.env.FAST_API_URL}/get-co2-level-prediction`;
    const response = await axios.post(apiUrl, {
      start_date,
      end_date,
    });

    const predictions = response.data.co2_prediction;
    const timeStamps = Object.values(predictions.ds);
    const co2Levels = Object.values(predictions.yhat);

    // Save the entire prediction set in one record
    const co2Prediction = new ALLCO2PredictionData({
      userId,
      startDate: start_date,
      endDate: end_date,
      timeStamps: timeStamps,
      co2Levels: co2Levels,
    });

    let savedObj = await co2Prediction.save();

    res.status(200).json({ savedObj });
  } catch (error) {
    console.error("Error saving CO2 predictions:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getCO2PredictionsByUserId = async (req, res) => {
  const userId = req.params.id;
  try {
    const predictions = await ALLCO2PredictionData.find({
      userId: userId,
    })
      .sort({ timestamp: -1 })
      .exec();
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAirPollutionByUserId = async (req, res) => {
  const userId = req.params.id;
  try {
    const predictions = await PMPredictionData.find({ userId: userId })
      .sort({ timestamp: -1 })
      .exec();
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
