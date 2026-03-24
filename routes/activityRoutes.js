const express = require("express");
const router = express.Router();
const { saveActivityLog, getActivityLogs } = require("../controllers/activityController");

router.post("/add", saveActivityLog);
router.get("/:userId", getActivityLogs);

module.exports = router;