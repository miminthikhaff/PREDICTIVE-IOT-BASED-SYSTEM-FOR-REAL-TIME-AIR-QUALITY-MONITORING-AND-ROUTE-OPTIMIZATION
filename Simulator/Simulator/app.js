const mqtt = require('mqtt');

// MQTT Broker URL and Topic
const mqttServer = 'mqtt://45.134.226.131';
const topic = 'iot/data';

// Connect to the MQTT broker
const client = mqtt.connect(mqttServer);

console.log("Simulator Started")

client.on('connect', () => {
    console.log('Connected to MQTT broker at ' + mqttServer);
    sendDataPeriodically();
});

function sendDataPeriodically() {
    setInterval(() => {
        // Simulate IoT sensor data
        const iotData = {
            iotDeviceId: "Borella Junction",
            gpsLatitude: 6.9196, // Static example data (Kadawathe location)
            gpsLongitude: 79.8735, // Static example data (Kadawathe location)
            co2Level: Math.random() * 100 + 400, // Random CO2 level between 400 and 500
            ch4Level: Math.random() * 5, // Random CO level between 0 and 5
            no2Level: Math.random() * 5,
            // so2Level: Math.random() * 5,
           
        };

        // Convert object to JSON string
        const message = JSON.stringify(iotData);

        // Publish the message to the MQTT topic
        client.publish(topic, message, {}, (error) => {
            if (error) {
                console.error('Failed to send message:', error);
            } else {
                console.log('Message sent:', message);
            }
        });
    }, 30000); // Send data every 5 seconds
}

client.on('error', (error) => {
    console.error('Connection error:', error);
});
