const axios = require("axios");
const CityPeriodicData = require("../models/CityPeriodicData");
require("dotenv").config();
// Function to build the graph from routes
// Function to build the graph from routes based on the metric provided
async function buildGraphFromRoutes(routes, metric) {
  let graph = {};

  for (const route of routes) {
    const start = route[0];
    const end = route[1];
    const value = route[2]; // This is the distance or traffic value depending on the metric

    console.log("============route=================");
    console.log(route);
    console.log("====================================");

    console.log("============end=================");
    console.log(end);
    console.log("====================================");
    console.log("============start=================");
    console.log(start);
    console.log("====================================");
    if (metric === "co2Level") {
      const timeThreshold = new Date(new Date() - 10 * 60 * 1000); // 10 minutes ago for CO2 level consideration
      const co2Levels = await CityPeriodicData.find({
        city: end,
        timestamp: { $gte: timeThreshold },
      }).sort({ timestamp: -1 });

      const averageCO2 =
        co2Levels.reduce((acc, curr) => acc + curr.co2Level, 0) /
          co2Levels.length || 0.002;
      if (!graph[start]) graph[start] = [];
      graph[start].push([end, averageCO2]);
    } else {
      // For distance and traffic, directly use the values provided
      if (!graph[start]) graph[start] = [];
      graph[start].push([end, value]);
    }
  }
  return graph;
}

// Generic function to find optimal route
async function findOptimalRoute(req, res, metric) {
  const { routes } = req.body;
  try {
    const graph = await buildGraphFromRoutes(routes, metric);
    const start = routes[0][0]; // Assuming start is the first point of the first route
    let end = routes[routes.length - 1].slice(-1)[0]; // End is the last point of the last route
    if (metric == "other") {
      end = routes[routes.length - 1][1];
    }
    console.log("==========graph=================");
    console.log(graph);
    console.log("====================================");

    console.log({
      graph,
      start,
      end,
    });
    const response = await axios.post(
      `${process.env.FAST_API_URL}/get-shortest-path`,
      {
        graph,
        start,
        end,
      }
    );

    res.json({ route: response.data });
  } catch (error) {
    console.error(`Error finding optimal route based on ${metric}:`, error);
    res.status(500).json({ message: error.message });
  }
}

// Endpoint handler for CO2
exports.findOptimalCO2Route = (req, res) => {
  findOptimalRoute(req, res, "co2Level");
};

// Endpoint handler for distance
exports.findShortestDistanceRoute = (req, res) => {
  findOptimalRoute(req, res, "other");
};

// Endpoint handler for traffic
exports.findOptimalTrafficRoute = (req, res) => {
  findOptimalRoute(req, res, "other");
};
