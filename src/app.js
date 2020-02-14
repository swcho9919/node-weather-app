const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();

// Define paths for Express config
const viewsPath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");

// Setup[ handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialPath);

// Setup static directory to server
app.use(express.static(path.join(__dirname, "../public")));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather app",
    name: "Cho Sung Woo"
  });
});

// app.get("/weather", (req, res) => {
//   if (!req.query.address) {
//     res.send({
//       error: "You must enter a valid address"
//     });
//   } else {
//     res.send({
//       forecast: "Raining",
//       location: "Seoul",
//       address: req.query.address
//     });
//   }
// });

app.get("/weather", (req, res) => {
  const location = req.query.address;
  if (!location) {
    res.send({
      error: "You must enter a valid address"
    });
  } else {
    geocode(
      req.query.address,
      (error, { latitude, longitude, location } = {}) => {
        if (error) {
          return res.send({
            error: "Try another address"
          });
        }
        forecast(latitude, longitude, (error, forecastData) => {
          if (error) {
            return res.send({
              error: "Error"
            });
          }
          res.send({
            location: location,
            forecast: forecastData,
            address: req.query.address
          });
        });
      }
    );
  }
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term"
    });
  }

  console.log(req.query.search);
  res.send({
    products: []
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "Cho Sung Woo"
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    msg: "Hello there, How may I help you?",
    title: "Help",
    name: "Cho Sung Woo"
  });
});

app.get("/help/*", (req, res) => {
  res.render("error404", {
    title: 404,
    errormsg: "Help article not found",
    name: "Cho Sung Woo"
  });
});

app.get("*", (req, res) => {
  res.render("error404", {
    title: "404",
    errormsg: "Page not found. You sure?",
    name: "Cho Sung Woo"
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server is up on port 3000");
});
