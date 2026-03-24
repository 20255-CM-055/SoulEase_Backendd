const Suggestion = require("../models/Suggestion");

exports.getSuggestions = async (req, res) => {
  try {

    const { category } = req.query;

    let suggestions;

    if(category){
      suggestions = await Suggestion.find({ category });
    } else {
      suggestions = await Suggestion.find();
    }

    res.json(suggestions);

  } catch (err) {
    res.status(500).json({ message: "Error fetching suggestions" });
  }
};