const mqtt = require("mqtt");
const IoTData = require("../models/IoTData");
const client = mqtt.connect("mqtt://45.134.226.131:1883");
//const processIotData = require('./IotDataProcessor');

const CityPeriodicData = require("../models/CityPeriodicData");
const CurrentCityAirLevel = require("../models/CurrentCityAirLevel");
const CurrentCityAirLevelHistory = require("../models/CurrentCityAirLevelHistory");
const { getCityFromCoordinates } = require("../helpers/locationHelper");

const THRESHOLDS = require("../helpers/consts");
const NotificationHistory = require("../models/NotificationHistory");
const User = require("../models/User");
//const {sendNotification} = require('./mqttClient');

client.on("connect", () => {
  console.log("Connected to MQTT broker");
  client.subscribe("iot/data", () => {
    console.log("Subscribed to topic iot/data");
  });
});

client.on("message", (topic, message) => {
  const data = JSON.parse(message.toString());
  const iotData = new IoTData(data);
  console.log(iotData);
  iotData
    .save()
    .then(() => {
      console.log("Data saved:", data);
      processIotData(data)
        .then(() => {
          console.log("Data processed successfully.");
        })
        .catch((error) => {
          console.error("Error processing data:", error);
        });
    })
    .catch((err) => console.error("Error saving data:", err));
});

// const sendNotification = (message) => {
//   client.publish("trigger/data", message, { qos: 1 }, (error) => {
//     if (error) {
//       console.error("Failed to send message: ", error);
//     }
//   });
// };

async function processIotData(data) {
  const {
    gpsLatitude,
    gpsLongitude,
    co2Level,
    no2Level,
    ch4Level,
    iotDeviceId,
  } = data;
  const city = await getCityFromCoordinates(gpsLatitude, gpsLongitude);

  console.log("+++++++++City: ", city);

  // Save periodic data
  const periodicData = new CityPeriodicData({ ...data, city });
  await periodicData.save();

  const timeWindowMinutes = 10; // Adjustable time window
  const startTime = new Date(new Date() - timeWindowMinutes * 60 * 1000);

  // Fetch recent data for this city
  const recentData = await CityPeriodicData.find({
    city,
    timestamp: { $gte: startTime },
  });

  let averageCO2 = co2Level,
    averageNO2 = no2Level,
    averageCH4 = ch4Level;

  if (recentData.length > 0) {
    averageCO2 =
      recentData.reduce((acc, curr) => acc + curr.co2Level, 0) /
      recentData.length;
    averageNO2 =
      recentData.reduce((acc, curr) => acc + curr.no2Level, 0) /
      recentData.length;
    averageCH4 =
      recentData.reduce((acc, curr) => acc + curr.ch4Level, 0) /
      recentData.length;
  }

  // Update or create current city air level data
  await CurrentCityAirLevel.findOneAndUpdate(
    { city },
    {
      gpsLatitude: gpsLatitude,
      gpsLongitude: gpsLongitude,
      averageCO2Level: averageCO2,
      averageNO2Level: averageNO2,
      averageCH4Level: averageCH4,
      timestamp: new Date(),
    },
    { new: true, upsert: true }
  );

  let copdStat = false;
  let asthmaStat = false;
  let bronchitisStat = false;
  let lungCancerStat = false;
  let heartDiseaseCancerStat = false;

  const notificationsToSend = [];

  for (const threshold of THRESHOLDS) {
    if (
      averageCO2 > threshold.values.co2 ||
      averageNO2 > threshold.values.no2
    ) {
      if (threshold.disease === "COPD") copdStat = true;
      if (threshold.disease === "Asthma") asthmaStat = true;
      if (threshold.disease === "bronchitis") bronchitisStat = true;
      if (threshold.disease === "lungCancer") lungCancerStat = true;
      if (threshold.disease === "heartDisease") heartDiseaseCancerStat = true;

      // Prepare notification data
      const msgData = {
        city: city,
        disease: threshold.disease,
      };
      const message = JSON.stringify(msgData);

      notificationsToSend.push({
        disease: threshold.disease,
        city: city,
        message: message,
      });

      console.log(`Thresholds met for ${threshold.disease} in ${city}`);
    }
  }

  // Send notifications to users if threshold values are met
  if (notificationsToSend.length > 0) {
    await sendPushNotifications(notificationsToSend, city);
  }

  const historyData = new CurrentCityAirLevelHistory({
    city: city,
    gpsLatitude: gpsLatitude,
    gpsLongitude: gpsLongitude,
    averageCO2Level: averageCO2,
    averageNO2Level: averageNO2,
    averageCH4Level: averageCH4,
    copdStat: copdStat,
    asthmaStat: asthmaStat,
    bronchitisStat: bronchitisStat,
    lungCancerStat: lungCancerStat,
    heartDiseaseCancerStat: heartDiseaseCancerStat,
    timestamp: new Date(),
  });

  const savedObj = await historyData.save();

  console.log("Saved history data: ", savedObj);
}

// Helper function to send push notifications
async function sendPushNotifications(notifications, city) {
  const timeWindowMinutes = 30;
  const startTime = new Date(new Date() - timeWindowMinutes * 60 * 1000);

  // Fetch users with diseases set to true
  const users = await User.find({
    $or: [
      { Asthma: true },
      { COPD: true },
      { bronchitis: true },
      { lungCancer: true },
      { heartDisease: true },
    ],
  });

  for (const user of users) {
    if (!user.token) continue; // Skip if no token available

    for (const notification of notifications) {
      const { disease, message } = notification;

      // Check if the user has the disease
      if (user[disease] === true) {
        // Check if a notification was sent for the same city and disease within the last 30 minutes
        const recentNotification = await NotificationHistory.findOne({
          userId: user._id,
          disease: disease,
          city: city,
          timestamp: { $gte: startTime },
        });

        if (!recentNotification) {
          // Send push notification
          await sendNotification(user.token, message);

          // Save notification history
          await NotificationHistory.create({
            userId: user._id,
            disease: disease,
            city: city,
            timestamp: new Date(),
          });

          console.log(
            `Sent notification for ${disease} in ${city} to ${user.username}`
          );
        }
      }
    }
  }
}

// Function to send the actual notification
async function sendNotification(token, message) {
  const notificationData = {
    to: token,
    sound: "default",
    title: "Air Pollution Alert!",
    body: "Air Pollution Alert!",
    data: { message },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(notificationData),
  });
}

module.exports = { client, sendNotification };
