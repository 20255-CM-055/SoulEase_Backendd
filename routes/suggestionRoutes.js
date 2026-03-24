const express = require("express");
const router = express.Router();
const { getSuggestions } = require("../controllers/suggestionController");

router.get("/", getSuggestions);

module.exports = router;