

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const predictRoutes = require("./routes/predictRoutes");
const cron = require("node-cron");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));


const authRoutes = require("./routes/authRoutes");
const journalRoutes = require("./routes/journalRoutes");
const app = express();
let tokens = [];
const quizRoutes = require("./routes/quizroutes");
const activityRoutes = require("./routes/activityRoutes");
const affirmationRoutes = require("./routes/affirmation");

app.use(cors());
app.use(express.json());
app.use("/api/journals", journalRoutes);
app.use("/predict", predictRoutes);
app.use("/api", affirmationRoutes);


// 👇 THIS IS IMPORTANT
app.use("/api/auth", authRoutes);
app.use("/api/activity", activityRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use("/api/quiz", quizRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))

  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

// app.post("/save-token", (req, res) => {
//   const { token } = req.body;

//   if (!token) {
//     return res.status(400).send("Token missing");
//   }

//   if (!tokens.includes(token)) {
//     tokens.push(token);
//   }

//   console.log("📱 Stored tokens:", tokens);

//   res.send("Token saved");
// });

app.post("/save-token", (req, res) => {
  console.log("🔥 /save-token HIT (RENDER)");
  console.log("📦 Body:", req.body);

  const { token } = req.body;

  if (!token) {
    console.log("❌ Token missing");
    return res.status(400).send("Token missing");
  }

  if (!tokens.includes(token)) {
    tokens.push(token);
  }

  console.log("📱 Stored tokens:", tokens);

  res.send("Token saved");
});

const sendNotification = async (token) => {
  try {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: token,
        title: "Soulease Reminder 🧠",
        body: "How are you feeling today?",
      }),
    });
  } catch (err) {
    console.log("❌ Notification error:", err);
  }
};

cron.schedule("*/1 * * * *", () => {
  console.log("⏰ Sending daily notifications...");
  console.log("📦 Tokens:", tokens);
  tokens.forEach(token => {
    sendNotification(token);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
