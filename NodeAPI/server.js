require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
require('./mqtt/mqttClient'); 

const app = express();

// Connect to database
connectDB();

// Middlewares
app.use(express.json());
app.use('/api', require('./routes/index'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
