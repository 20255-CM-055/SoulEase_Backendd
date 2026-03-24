const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema({
  title: String,
  type: String,        // Video, Exercise, Music, Podcast
  category: String,    // sleep, focus, reset
  duration: String,
  description: String,
  sourceUrl: String,
  thumbnail: String
});

module.exports = mongoose.model("Suggestion", suggestionSchema);