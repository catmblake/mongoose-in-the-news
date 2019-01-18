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
mongoose.connect("mongodb://localhost/mongoHeadLines", { useNewUrlParser: true });

app.get("/", function(req, res) {
  res.render("index");
});

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("http://www.huffingtonpost.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every div with class card content, and do the following:
    $("div.card__content").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      var titleString = $(element)
        .find("div.card__headline__text")
        .text();

      var linkString = $(element)
        .find("a")
        .attr("href");

      result.title = titleString.slice(1, -1);
      result.link = `http://huffingtonpost.com${linkString}`;

      //Create a new Article using the result object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});



// Start the server
app.listen(PORT, function() {
  console.log(`App running on port ${PORT}!`);
});