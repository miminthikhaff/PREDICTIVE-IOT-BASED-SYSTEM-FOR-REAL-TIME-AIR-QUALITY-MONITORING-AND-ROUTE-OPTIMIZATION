const mqtt = require("mqtt");

// Connect to the MQTT broker (replace with your broker URL and credentials if needed)
const client = mqtt.connect("mqtt://45.134.226.131:1883");

// Subscribe to a topic
const topic = "trigger/data";

client.on("connect", () => {
  console.log("Connected to MQTT broker");

  // Subscribe to the topic
  client.subscribe(topic, (err) => {
    if (err) {
      console.error("Failed to subscribe:", err);
    } else {
      console.log(`Subscribed to topic: ${topic}`);
    }
  });
});

// Log the received messages
client.on("message", (topic, message) => {
  const data = JSON.parse(message.toString());
  console.log(
    `Air Quality in '${data.city}' is hazardous for ${data.disease} patients`
  );
});

// Handle connection error
client.on("error", (err) => {
  console.error("Connection error:", err);
});
