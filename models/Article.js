var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// New Article schema
var ArticleSchema = new Schema({
  // title: type string, required
  title: {
    type: String,
    required: true
  },
  // byline: type string, not required
  byline: {
    type: String,
    required: false
  },
  // image: type string, not required
  image: {
    type: String,
    required: false
  },
  // link: type: string, required
  link: {
    type: String,
    required: true
  },
  // note is an object that stores a Note id
  // ref links the ObjectId of Article to the associated note
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;