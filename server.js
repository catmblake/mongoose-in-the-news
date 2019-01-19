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

// Connecting to either mLab or local MongoDB
var databaseUri = "mongodb://localhost/mongoHeadLines";

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
mongoose.connect(databaseUri);
}

var database = mongoose.connection;

database.on("error", function(err) {
  console.log("Mongoose Error ", err);
});

database.once("open", function (){
  console.log("Mongoose connection successful.");
});

  // Function to grab the body of the html with axios
  function scrapeArticles() { 
  axios.get("http://www.huffingtonpost.com/").then(function (response) {
    // Load into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Grab every div with class card content, and do the following:
    $("div.card__content").each(function (i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      var titleString = $(element)
        .find("div.card__headline__text")
        .text();

      var byString = $(element)
        .find("div.card__byline")
        .text();

      var linkString = $(element)
        .find("a")
        .attr("href");

      result.title = titleString.slice(1, -1);
      result.byline = byString.slice(0, -3);
      result.link = `http://huffingtonpost.com${linkString}`;

      result.image = $(element)
        .find("div.card__image")
        .children()
        .attr("src");
      //Create a new Article using the result object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
        })
        .catch(function (err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
  });
};

// A GET route for scraping the huffpost website
app.get("/scrape", function (req, res) {
  scrapeArticles();
  res.send("Scrape Complete");
})
// Route for getting all Articles from the db
app.get("/", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function (dbArticle) {
      // Send all Articles to the client
      console.log(dbArticle)
      res.render("index", { article: dbArticle });
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for deleting all articles from database
app.delete("/scrape", function (req, res) {
  db.Article.deleteMany({})
  .then(function (dataDeleted) {
    console.log(dataDeleted);
    res.send("Articles Removed");
  })
})

// Route for grabbing a specific Article by id
app.get("/articles/:id", function (req, res) {
  db.Article.findOne({ _id: req.params.id })
    // Populate all notes associated with it
    .populate("note")
    .then(function (dbArticle) {
      // If Article exists, send to client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If error, send to client
      res.json(err);
    });
});
// Route for saving articles
app.post("/saved", function (req, res) {
  db.Article.findByIdAndUpdate(req.body.id, {
    $set: {
      saved: req.body.saved
    }
  }, {
      new: true

    })
    .then(function (dbSaved) {
      res.json(dbSaved);
    })
    .catch(function (err) {
      // If error, send to client
      res.json(err);
    })
});
// Route for removing saved articles
app.put("/saved", function (req, res) {
  db.Article.findByIdAndUpdate(req.body.id, {
    $set: {
      saved: req.body.saved
    }
  }, {
      new: true

    })
    .then(function (dbRemoved) {
      res.json(dbRemoved);
    })
    .catch(function (err) {
      // If error, send to client
      res.json(err);
    })
});

// Route for getting all saved articles
app.get("/saved", function(req, res){
  db.Article.find({"saved": true})
  .populate("notes")
  .then(function (saved, err) {
    res.render("saved", {article: saved})
  })
})
// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  // Create a new note
  db.Note.create(req.body)
    .then(function (dbNote) {
      // Add note to be associated with it's article
      return db.Article.findOneAndUpdate({ _id: req.params.id }, {$push: { notes: dbNote._id } }, { new: true });
    })
    .then(function (dbArticle) {
      // Send article back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If error, send to client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function () {
  console.log(`App running on port ${PORT}!`);
});