const request = require("request");

const forecast = (latitude, longitude, callback) => {
  const url =
    "https://api.darksky.net/forecast/f612c963594c2aab396292804fb918ff/" +
    latitude +
    "," +
    longitude +
    "?units=si";

  request({ url, json: true }, (error, response) => {
    if (error) {
      callback("Unable to connect to forecast services", undefined);
    } else if (response.body.error) {
      callback("Unable to find location, try another search");
    } else {
      callback(
        undefined,
        "It is currently " +
          response.body.currently.temperature +
          " degrees. There is a " +
          response.body.currently.precipProbability +
          "% chance of rain. Have a nice day :)"
      );
    }
  });
};

module.exports = forecast;
