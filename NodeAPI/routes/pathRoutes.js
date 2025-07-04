const express = require('express');
const router = express.Router();
const {
    findOptimalCO2Route,
    findShortestDistanceRoute,
    findOptimalTrafficRoute
} = require('../controllers/pathController');

router.post('/optimal-co2-route', findOptimalCO2Route);
router.post('/shortest-distance-route', findShortestDistanceRoute);
router.post('/optimal-traffic-route', findOptimalTrafficRoute);

module.exports = router;
