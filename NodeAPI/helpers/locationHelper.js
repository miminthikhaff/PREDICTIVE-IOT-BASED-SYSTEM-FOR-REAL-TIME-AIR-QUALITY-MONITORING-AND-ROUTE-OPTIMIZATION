const axios = require("axios");
// Replace with your API key
require("dotenv").config();

const getCityFromCoordinates = async (lat, lng) => {
  const googleMapsApiKey = process.env.googleMapsApiKey;

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleMapsApiKey}`;
  try {
    const response = await axios.get(url);
    const results = response.data.results;

    if (results.length > 0) {
      // Find the most detailed address component that could represent a place or neighborhood
      let placeInfo = null;

      // Loop through all results
      for (const result of results) {
        // Check if the result is detailed enough (e.g., neighborhood, premise, or street address)
        placeInfo = result.address_components.find(
          (comp) =>
            comp.types.includes("neighborhood") ||
            comp.types.includes("sublocality") ||
            comp.types.includes("premise") ||
            comp.types.includes("street_address")
        );

        if (placeInfo) {
          console.log("===============placeInfo================");
          console.log(placeInfo);
          console.log("====================================");
          return placeInfo.long_name; // Return the most specific place name found
        }
      }

      // Fallback to less specific types if no neighborhood or premise is found
      for (const result of results) {
        placeInfo = result.address_components.find(
          (comp) =>
            comp.types.includes("locality") ||
            comp.types.includes("administrative_area_level_3")
        );

        if (placeInfo) {
          console.log("===============placeInfo broad ================");
          console.log(placeInfo);
          console.log("====================================");
          return placeInfo.long_name;
        }
      }
    }
    return "Unknown Location";
  } catch (err) {
    console.log(err);
  } // Return default when no suitable location is found
};

module.exports = { getCityFromCoordinates };
