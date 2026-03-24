const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/:vibe", async (req,res)=>{

const vibe = req.params.vibe;

let query="";

if(vibe==="focus") query="focus ambient music";
if(vibe==="reset") query="calm meditation music";
if(vibe==="sleep") query="rain sleep ambient";
if(vibe==="insight") query="mindfulness meditation music";

const response = await axios.get(
`https://pixabay.com/api/sounds/?key=${process.env.PIXABAY_API_KEY}&q=${query}`
);

res.json(response.data.hits);

});

module.exports = router;