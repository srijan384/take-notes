const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


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


// ================= SUMMARIZE NOTE =================
router.post("/:id/summarize", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    // Cache hit - return existing summary
    if (note.aiSummary) {
      return res.json({ success: true, summary: note.aiSummary });
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Call Gemini API
    const prompt = `Provide a concise, bulleted summary of the following text:\n\n${note.content}`;
    const result = await model.generateContent(prompt);
    const summaryResponse = result.response.text();

    // Save summary to database
    note.aiSummary = summaryResponse;
    await note.save();

    return res.json({ success: true, summary: note.aiSummary });

  } catch (err) {
    console.error("Gemini API Error in /summarize:", err.message || err);
    return res.status(500).json({ success: false, message: "Server error during summarization" });
  }
});

// ================= CHAT WITH NOTE =================
router.post("/:id/chat", async (req, res) => {
  const { userMessage } = req.body;

  if (!userMessage) {
    return res.status(400).json({ success: false, message: "userMessage is required" });
  }

  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Initialize an actual chat session with context prefix
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `You are a helpful tutor. Use the following note content to answer the user's questions. Note Content:\n\n${note.content}` }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I'm ready to answer any questions based on the provided note content." }],
        },
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const responseText = result.response.text();

    return res.json({ success: true, aiResponse: responseText });

  } catch (err) {
    console.error("Gemini API Error in /chat:", err.message || err);
    return res.status(500).json({ success: false, message: "Server error during chat" });
  }
});


// ================= EXPORT =================
module.exports = router;