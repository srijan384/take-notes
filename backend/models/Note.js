const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  email: String,     // to identify user
  title: String,
  content: String,
  aiSummary: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Note", NoteSchema);