// import express from "express";
// import Groq from "groq-sdk";

// const router = express.Router();

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// router.post("/affirmation", async (req, res) => {
//   const { text } = req.body;

//   if (!text) {
//     return res.status(400).json({ affirmation: "No input provided" });
//   }

//   try {
//     const response = await groq.chat.completions.create({
//       model: "llama-3.3-70b-versatile",
//       messages: [
//         {
//           role: "system",
//           content: "You are a deeply empathetic mental wellness coach.",
//         },
//         {
//           role: "user",
//           content: `User wrote: "${text}"

// Generate a powerful, comforting, and personal affirmation.
// - Acknowledge their feeling
// - Be warm and human
// - Keep it under 20 words
// - Avoid generic phrases

// Return only the affirmation.`,
//         },
//       ],
//       temperature: 0.8,
//     });

//     const affirmation =
//       response.choices[0]?.message?.content || "Stay strong 💙";

//     res.json({ affirmation });
//   } catch (err) {
//     console.log("Groq error:", err);
//     res.status(500).json({ affirmation: "Something went wrong" });
//   }
// });

// export default router;


const express = require("express");
const Groq = require("groq-sdk");

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/affirmation", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ affirmation: "No input provided" });
  }

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a deeply empathetic mental wellness coach.",
        },
        {
          role: "user",
          content: `User wrote: "${text}"

Generate a powerful, comforting, and personal affirmation.
- Acknowledge their feeling
- Be warm and human
- Keep it under 20 words
- Avoid generic phrases

Return only the affirmation.`,
        },
      ],
      temperature: 0.8,
    });

    const affirmation =
      response.choices[0]?.message?.content || "Stay strong 💙";

    res.json({ affirmation });
  } catch (err) {
    console.log("Groq error:", err);
    res.status(500).json({ affirmation: "Something went wrong" });
  }
});

module.exports = router;