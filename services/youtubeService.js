// const axios = require("axios");

// const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// async function getYoutubeVideos(query) {
//   const url = "https://www.googleapis.com/youtube/v3/search";

//   const response = await axios.get(url, {
//     params: {
//       part: "snippet",
//       q: query,
//       type: "video",
//       maxResults: 3,
//       key: YOUTUBE_API_KEY,
//     },
//   });

//   return response.data.items.map((item) => ({
//     title: item.snippet.title,
//     // url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
//     url: `https://www.youtube.com/embed/${item.id.videoId}`
//   }));
// }

// module.exports = { getYoutubeVideos };















const axios = require("axios");

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

async function getYoutubeVideos(query) {
  const url = "https://www.googleapis.com/youtube/v3/search";

  try {

    const response = await axios.get(url, {
      params: {
        part: "snippet",
        q: query,
        type: "video",
        maxResults: 3,

        // ✅ Only return videos that allow embedding
        videoEmbeddable: "true",

        // optional but improves results
        safeSearch: "strict",

        key: YOUTUBE_API_KEY
      }
    });

    return response.data.items.map((item) => ({
      title: item.snippet.title,

      // ✅ Clean embed URL
      // url: `https://www.youtube.com/embed/${item.id.videoId}?rel=0&modestbranding=1`
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));

  } catch (error) {

    console.error("YouTube API Error:", error.message);

    return [];
  }
}

module.exports = { getYoutubeVideos };