// Requiring express, morgan and mongoose npms
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Requiring axios and cheerio npms for scraping
var axios = require("axios");
var cheerio = require("cheerio");

// Requiring all models
var db = require("./models");

var PORT = 3000;

var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Require Handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to Mongo DB
mongoose.connect("mongodb://localhost/mongooseInTheNews", { useNewUrlParser: true });

app.get("/", function(req, res) {
  res.render("index");
});

// Start the server
app.listen(PORT, function() {
  console.log(`App running on port ${PORT}!`);
});