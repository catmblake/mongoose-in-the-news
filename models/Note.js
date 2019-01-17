var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// creates a new NoteSchema object using Schema constructor
var NoteSchema = new Schema({
  title: String,
  body: String
});

// Creates model from the above schema
var Note = mongoose.model("Note", NoteSchema);

// Exports Note model
module.exports = Note;