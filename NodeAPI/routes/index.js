const express = require('express');
const router = express.Router();

router.use('/users', require('./userRoutes'));
router.use('/levels', require('./dataRoutes'));
router.use('/route', require('./pathRoutes'));
router.use('/prediction', require('./predictionRotes'));

module.exports = router;
