
const express = require("express");
const router = express.Router();
const axios = require("axios");
const crypto = require("crypto");
const { getYoutubeVideos } = require("../services/youtubeService");
const multer = require("multer");
const fs = require("fs");
const FormData = require("form-data");

const upload = multer({ dest: "uploads/" });

/* ========================= */
/* 🎵 Fetch Music from Jamendo */
/* ========================= */
async function fetchJamendoMusic(emotion) {

  try {

    const moodMap = {
      sadness: "sad",
      joy: "happy",
      anger: "calm",
      fear: "relaxing",
      anxiety: "calm",
      stress: "focus",
      surprise: "uplifting",
      love: "romantic",
      neutral: "chill"
    };

    const tag = moodMap[emotion] || "chill";

    const response = await axios.get(
      "https://api.jamendo.com/v3.0/tracks/",
      {
        params: {
          client_id: process.env.JAMENDO_CLIENT_ID,
          format: "json",
          limit: 4,
          tags: tag,
          include: "musicinfo",
          audioformat: "mp32"
        }
      }
    );

    return response.data.results.map(track => ({
      title: track.name,
      url: track.audio,
      duration: `${Math.floor(track.duration / 60)} min`
    }));

  } catch (error) {

    console.error("Jamendo Fetch Error:", error.message);
    return [];

  }

}


/* ========================= */
/* 🎥 Video query generator */
/* ========================= */
function getVideoQuery(emotion) {

  const map = {
    sadness: "healing meditation for sadness",
    joy: "positive meditation",
    anger: "anger calming meditation",
    fear: "fear release meditation",
    anxiety: "guided breathing meditation",
    stress: "stress relief meditation",
    surprise: "mindfulness meditation",
    love: "heart opening meditation",
    neutral: "mindfulness meditation"
  };

  return map[emotion] || "mindfulness meditation";

}


/* ========================= */
/* 🎧 Podcast query generator */
/* ========================= */
function getPodcastQuery(emotion) {

  const map = {
    sadness: "mental health",
    joy: "self improvement",
    anger: "anger management",
    fear: "overcoming fear",
    anxiety: "anxiety relief",
    stress: "stress management",
    surprise: "mindfulness",
    love: "relationships",
    neutral: "meditation"
  };

  return map[emotion] || "mindfulness";

}


/* ========================= */
/* 🎧 Fetch Podcasts */
/* ========================= */
async function fetchPodcasts(emotion) {

  try {

    const key = process.env.PODCAST_INDEX_KEY;
    const secret = process.env.PODCAST_INDEX_SECRET;

    const time = Math.floor(Date.now() / 1000);

    const hash = crypto
      .createHash("sha1")
      .update(key + secret + time)
      .digest("hex");

    const headers = {
      "User-Agent": "SoulEaseApp/1.0",
      "X-Auth-Key": key,
      "X-Auth-Date": time,
      Authorization: hash
    };

    const query = getPodcastQuery(emotion);

    const response = await axios.get(
      "https://api.podcastindex.org/api/1.0/search/byterm",
      {
        headers,
        params: { q: query }
      }
    );

    return response.data.feeds.slice(0,4).map(podcast => ({
      title: podcast.title,
      url: podcast.url,
      description: podcast.description?.substring(0,120) || ""
    }));

  } catch (error) {

    console.error("Podcast Fetch Error:", error.message);
    return [];

  }

}


/* ========================= */
/* 🎤 VOICE PREDICT ROUTE */
/* ========================= */

router.post("/voice", upload.single("audio"), async (req, res) => {

  let audioPath = null;

  try {

    if (!req.file) {
      return res.status(400).json({ error: "Audio file is required" });
    }

    audioPath = req.file.path;

    const formData = new FormData();
    // formData.append("audio", fs.createReadStream(audioPath));
//     formData.append("audio", fs.createReadStream(audioPath), {
//   filename: "audio.wav",
//   contentType: "audio/wav"
// });
const fileBuffer = fs.readFileSync(audioPath);

formData.append("audio", fileBuffer, {
  filename: "audio.wav",
  contentType: "audio/wav"
});

    console.log("🎤 Sending audio to Whisper...");

    const whisperResponse = await axios.post(
      // "http://127.0.0.1:5001/speech-to-text",
      "https://ey200506-new-ai-backend.hf.space/speech-to-text",
      formData,
      {
        // headers: formData.getHeaders(),
        headers: {
  ...formData.getHeaders(),
  "Accept": "application/json"
},
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
         timeout: 120000 
      }
    );

    const text = whisperResponse.data.text;

    console.log("📝 Transcribed Text:", text);

    /* Call Python emotion model */

    const bertResponse = await axios.post(
      // "http://127.0.0.1:5001/predict",
      "https://ey200506-new-ai-backend.hf.space/predict",
      { text }
    );

    const emotion = bertResponse.data.emotion;
    const confidence = bertResponse.data.confidence;

    /* Fetch suggestions */

    const [musicResults, videoResults, podcastResults] = await Promise.all([
      fetchJamendoMusic(emotion),
      getYoutubeVideos(getVideoQuery(emotion)),
      fetchPodcasts(emotion)
    ]);

    // res.json({
    //   text,
    //   emotion,
    //   confidence,
    //   suggestions: {
    //     music: musicResults,
    //     video: videoResults,
    //     podcast: podcastResults,
    //     exercise: []
    //   }
    // });
    res.json({
  text,
  emotion: bertResponse.data.emotion,
  secondary_emotion: bertResponse.data.secondary_emotion,
  is_conflicted: bertResponse.data.is_conflicted,
  all_emotions: bertResponse.data.all_emotions,
  confidence: bertResponse.data.confidence,
  suggestions: {
    music: musicResults,
    video: videoResults,
    podcast: podcastResults,
    exercise: []
  }
});

  } catch (error) {

    console.error("❌ Voice Prediction Error:", error.response?.data || error.message);

    res.status(500).json({
      emotion: "neutral",
      confidence: 50,
      suggestions: {
        music: [],
        video: [],
        podcast: [],
        exercise: []
      }
    });

  } finally {

    /* Clean up uploaded file */

    if (audioPath && fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
    }

  }

});


/* ========================= */
/* 🚀 TEXT PREDICT ROUTE */
/* ========================= */

router.post("/", async (req, res) => {

  try {

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    console.log("📥 Text received:", text);

    const bertResponse = await axios.post(
      // "http://127.0.0.1:5001/predict",
      "https://ey200506-new-ai-backend.hf.space/predict",
      { text }
    );

    console.log("🤖 Python response:", bertResponse.data);

    const emotion = bertResponse.data.emotion;
    const confidence = bertResponse.data.confidence;

    const [musicResults, videoResults, podcastResults] = await Promise.all([
      fetchJamendoMusic(emotion),
      getYoutubeVideos(getVideoQuery(emotion)),
      fetchPodcasts(emotion)
    ]);

    // res.json({
    //   emotion,
    //   confidence,
    //   suggestions: {
    //     music: musicResults,
    //     video: videoResults,
    //     podcast: podcastResults,
    //     exercise: []
    //   }
    // });
    res.json({
  emotion: bertResponse.data.emotion,
  secondary_emotion: bertResponse.data.secondary_emotion,
  is_conflicted: bertResponse.data.is_conflicted,
  all_emotions: bertResponse.data.all_emotions,
  confidence: bertResponse.data.confidence,
  suggestions: {
    music: musicResults,
    video: videoResults,
    podcast: podcastResults,
    exercise: []
  }
});

  } catch (error) {

    console.error("❌ Prediction Error:", error.response?.data || error.message);

    res.status(500).json({
      emotion: "neutral",
      confidence: 50,
      suggestions: {
        music: [],
        video: [],
        podcast: [],
        exercise: []
      }
    });

  }

});

module.exports = router;
