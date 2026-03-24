


const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    content: {
      type: String,
      required: true
    },
    mood: {
      type: String,
      default: "neutral"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Journal", journalSchema);