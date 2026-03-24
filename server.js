const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const predictRoutes = require("./routes/predictRoutes");


const authRoutes = require("./routes/authRoutes");
const journalRoutes = require("./routes/journalRoutes");
const app = express();
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
