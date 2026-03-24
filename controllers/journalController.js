

// const Journal = require("../models/Journal");

// // CREATE JOURNAL
// exports.createJournal = async (req, res) => {
//   try {
//     const { content, mood } = req.body;

//     const journal = await Journal.create({
//       user: req.user.id,
//       content,
//       mood,
//     });

//     res.status(201).json(journal);

//   } catch (error) {
//     console.error("Journal Save Error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };


// // GET JOURNALS FOR LOGGED USER
// exports.getJournals = async (req, res) => {
//   try {

//     const journals = await Journal.find({
//       user: req.user.id
//     }).sort({ createdAt: -1 });

//     res.json(journals);

//   } catch (error) {
//     console.error("Fetch Journals Error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };







const Journal = require("../models/Journal");


// CREATE JOURNAL
exports.createJournal = async (req, res) => {

  try {

    const { content, mood } = req.body;

    const journal = await Journal.create({
      user: req.user.id,
      content,
      mood
    });

    res.status(201).json(journal);

  } catch (error) {

    console.error("Journal Save Error:", error);
    res.status(500).json({ message: "Server error while saving journal" });

  }

};



// GET USER JOURNALS
exports.getJournals = async (req, res) => {

  try {

    const journals = await Journal
      .find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(journals);

  } catch (error) {

    console.error("Fetch Journals Error:", error);
    res.status(500).json({ message: "Server error while fetching journals" });

  }

};

// DELETE JOURNAL
exports.deleteJournal = async (req, res) => {

  try {

    const journal = await Journal.findById(req.params.id);

    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    if (journal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await journal.deleteOne();

    res.json({ message: "Journal deleted" });

  } catch (error) {

    console.error("Delete Journal Error:", error);
    res.status(500).json({ message: "Server error while deleting journal" });

  }

};