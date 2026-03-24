// const User = require("../models/User");

// exports.saveActivityLog = async (req, res) => {
//   try {
//     const { userId, log } = req.body;

//     const user = await User.findById(userId);

//     user.activityLogs.push(log);
//     await user.save();

//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to save log" });
//   }
// };

// exports.getActivityLogs = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId);
//     res.json(user.activityLogs || []);
//   } catch {
//     res.status(500).json({ error: "Failed to fetch logs" });
//   }
// };










const User = require("../models/User");

exports.saveActivityLog = async (req, res) => {
  try {
    const { userId, log } = req.body;

    console.log("🔥 Incoming log:", req.body); // DEBUG

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.activityLogs.push(log);

    await user.save();

    res.json({ success: true });

  } catch (err) {
    console.log("Save error:", err);
    res.status(500).json({ error: "Failed to save activity" });
  }
};

exports.getActivityLogs = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.activityLogs || []);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};