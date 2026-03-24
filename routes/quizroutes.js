const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
console.log("🔥 quizRoutes loaded");
const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/generate-quiz", async (req, res) => {
  console.log("🔥 HIT generate-quiz route");
  try {
    const prompt = `
Return ONLY valid JSON. No explanation.

Generate 5 mental wellness multiple-choice questions.

Format:
[
  {
    "question": "...",
    "options": ["...", "...", "...", "..."]
  }
]
`;
//     const response = await axios.post(
//   `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//   {
//     contents: [{ parts: [{ text: prompt }] }]
//   }
// );
//     const text = response.data.candidates[0].content.parts[0].text;

const completion = await groq.chat.completions.create({
  model: "llama-3.1-8b-instant",
  messages: [
    {
      role: "user",
content: `
You are a friendly mental wellness app.

Generate 5-6 simple and relatable questions to understand how a person is feeling RIGHT NOW.

Rules:
- Use very simple English (like talking to a friend)
- Keep questions short (1 line)
- DO NOT ask directly "how do you feel"
- Questions should feel natural and indirect
- Each question must focus on a different aspect (sleep, thoughts, energy, stress, social, focus)

IMPORTANT:
- Each question MUST have its own UNIQUE options
- Options must MATCH the question (no repeated options)
- Options should feel natural and human (not labels like calm/stress)
- Keep options short (3–6 words max)

Example:
Q: "How was your sleep last night?"
Options: ["slept really well", "okay sleep", "kept waking up", "couldn’t sleep"]

Return ONLY valid JSON:

[
  {
    "question": "string",
    "options": ["option1", "option2", "option3", "option4"]
  }
]
`
    }
  ],
  temperature: 0.7,
});

const text = completion.choices[0].message.content;
   
    // const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonMatch = text.match(/\[[\s\S]*\]/);

if (!jsonMatch) {
  console.log("❌ No JSON found:", text);
  return res.status(500).json({ error: "Invalid AI response" });
}

const cleanText = jsonMatch[0];

    // res.json(JSON.parse(cleanText));
    console.log("Gemini raw response:", text);
    try {
  const parsed = JSON.parse(cleanText);
  res.json(parsed);
} catch (e) {
  console.log("❌ JSON Parse Error:");
  console.log(cleanText);   // 👈 VERY IMPORTANT
  res.status(500).json({ error: "Invalid AI response" });
}

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Quiz generation failed" });
//   }
}catch (err) {
  console.log("❌ FULL ERROR:");
  console.log(err.response?.data || err.message || err);

  res.status(500).json({
    error: "Quiz generation failed",
    details: err.response?.data || err.message
  });
}
});

// router.post("/analyze-quiz", async (req, res) => {
//   try {
//     const { answers } = req.body;

//     const prompt = `
// User answered the following mental wellness quiz:

// ${JSON.stringify(answers)}

// Based on this, give:
// 1. A short supportive message
// 2. One practical action they can do right now

// Return ONLY JSON:
// {
//   "message": "string",
//   "action": "string"
// }
// `;

//     const response = await axios.post(
//   `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//   {
//     contents: [{ parts: [{ text: prompt }] }]
//   }
// );

//     const text = response.data.candidates[0].content.parts[0].text;

//     const jsonMatch = text.match(/\{[\s\S]*\}/);
// if (!jsonMatch) {
//   console.log("❌ No JSON found:", text);
//   return res.status(500).json({ error: "Invalid AI response" });
// }

// const cleanText = jsonMatch[0];

//     console.log("Gemini raw response:", text);
//     // res.json(JSON.parse(cleanText));
//     try {
//   // const parsed = JSON.parse(cleanText);
//   let parsed;

// try {
//   parsed = JSON.parse(cleanText);
// } catch (e) {
//   console.log("❌ JSON Parse Error:");
//   console.log(cleanText);

//   return res.status(500).json({
//     error: "Invalid AI response",
//   });
// }

// if (!Array.isArray(parsed)) {
//   return res.status(500).json({
//     error: "AI returned invalid format",
//   });
// }

// res.json(parsed);
//   res.json(parsed);
// } catch (e) {
//   console.log("❌ JSON Parse Error:");
//   console.log(cleanText);   // 👈 VERY IMPORTANT
//   res.status(500).json({ error: "Invalid AI response" });
// }

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Quiz analysis failed" });
//   }
// });


router.post("/analyze-quiz", async (req, res) => {
  try {
    const { answers } = req.body;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `
User answered these questions:

${JSON.stringify(answers)}

Based on this:

- Give a short, friendly message (simple English)
- Give one small helpful action

Keep it:
- supportive
- human
- not robotic

Return ONLY JSON:

{
  "message": "string",
  "action": "string"
}
`
        }
      ],
      temperature: 0.7,
    });

    const text = completion.choices[0].message.content;

    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return res.status(500).json({ error: "Invalid AI response" });
    }

    const parsed = JSON.parse(jsonMatch[0]);

    res.json(parsed);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Quiz analysis failed" });
  }
});

module.exports = router;