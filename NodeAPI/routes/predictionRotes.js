const express = require("express");
const router = express.Router();
const { predictAirPollution } = require("../controllers/predictionController");
const { findLowestCO2Hour } = require("../controllers/predictionController");
const {
  saveAllCO2Predictions,
} = require("../controllers/predictionController");
const {
  getAirPollutionByUserId,
} = require("../controllers/predictionController");
const {
  getCO2PredictionsByUserId,
} = require("../controllers/predictionController");

router.post("/predict-air-pollution", predictAirPollution);
router.post("/lowest-co2-hour", findLowestCO2Hour);
router.post("/predict-co2-hour", saveAllCO2Predictions);
router.get("/co2-predictions/:id", getCO2PredictionsByUserId);
router.get("/air-pollution-predictions/:id", getAirPollutionByUserId);

module.exports = router;
