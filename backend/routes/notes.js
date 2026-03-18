const express = require("express");
const router = express.Router();
const Note = require("../models/Note");


// ================= ADD NOTE =================
router.post("/add", async (req, res) => {
  const { email, title, content } = req.body;

  console.log("ADD NOTE BODY:", req.body); // 🔥 DEBUG

  if (!email || !title || !content) {
    return res.json({
      success: false,
      message: "All fields are required"
    });
  }

  try {
    const newNote = new Note({ email, title, content });
    await newNote.save();

    return res.json({
      success: true,
      note: newNote // 🔥 IMPORTANT (send back note)
    });

  } catch (err) {
    console.log("Add Note Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


// ================= GET NOTES =================
router.get("/:email", async (req, res) => {
  try {
    const notes = await Note.find({ email: req.params.email })
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      notes
    });

  } catch (err) {
    console.log("Fetch Notes Error:", err);
    return res.status(500).json({
      success: false,
      notes: []
    });
  }
});


// ================= DELETE NOTE =================
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.json({
        success: false,
        message: "Note not found"
      });
    }

    return res.json({
      success: true
    });

  } catch (err) {
    console.log("Delete Error:", err);
    return res.status(500).json({
      success: false
    });
  }
});


// ================= UPDATE NOTE =================
router.put("/:id", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.json({
      success: false,
      message: "All fields required"
    });
  }

  try {
    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );

    if (!updated) {
      return res.json({
        success: false,
        message: "Note not found"
      });
    }

    return res.json({
      success: true,
      note: updated
    });

  } catch (err) {
    console.log("Update Error:", err);
    return res.status(500).json({
      success: false
    });
  }
});



// ================= EXPORT =================
module.exports = router;