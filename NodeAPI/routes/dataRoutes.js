const express = require("express");
const router = express.Router();
const {
  getAllCityAirLevels,
  getAirLevelsByCity,
  getActiveCityAirLevels,
  getAirLevelsHistoryByCity,
  getIoTDataById,
} = require("../controllers/dataController");

router.get("/all-city-levels", getAllCityAirLevels);
router.get("/active-city-levels", getActiveCityAirLevels);
router.get("/a-city-level/:city", getAirLevelsByCity);
router.get("/a-city-history/:city", getAirLevelsHistoryByCity);
router.get("/a-iot-history/:id", getIoTDataById);
//sample: http://localhost:3000/<root path>/a-iot-history/sim1

module.exports = router;
