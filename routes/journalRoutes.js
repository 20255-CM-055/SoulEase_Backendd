// const express = require("express");
// const router = express.Router();
// const axios = require("axios"); 
// const { createJournal, getJournals } = require("../controllers/journalController");
// const auth = require("../middleware/authMiddleware");
// const { createJournal, getJournals, deleteJournal } =
// require("../controllers/journalController");

// router.post("/", auth, createJournal);
// router.get("/", auth, getJournals);
// router.delete("/:id", auth, deleteJournal);

// module.exports = router;




const express = require("express");
const router = express.Router();

const { createJournal, getJournals, deleteJournal } =
require("../controllers/journalController");

const auth = require("../middleware/authMiddleware");

router.post("/", auth, createJournal);
router.get("/", auth, getJournals);
router.delete("/:id", auth, deleteJournal);

module.exports = router;