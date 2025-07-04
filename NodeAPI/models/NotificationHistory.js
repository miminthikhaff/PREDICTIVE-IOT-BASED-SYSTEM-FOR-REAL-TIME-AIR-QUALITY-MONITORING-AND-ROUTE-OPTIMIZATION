const mongoose = require("mongoose");

const NotificationHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User2 model
    required: true,
  },
  disease: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Time when the notification was sent
    required: true,
  },
});

module.exports = mongoose.model(
  "NotificationHistory",
  NotificationHistorySchema
);
