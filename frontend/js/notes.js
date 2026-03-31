const user = JSON.parse(localStorage.getItem("user"));
const email = user.email;


// Load Notes
async function loadNotes() {
    const res = await fetch(`http://127.0.0.1:5001/api/notes/${email}`);
    const data = await res.json();
  
    const notes = data.notes;
  
    const notesList = document.getElementById("notesList");
    notesList.innerHTML = "";
  
    notes.forEach(note => {
      notesList.innerHTML += `
        <div class="note" onclick="openNote('${note._id}', '${note.title}', \`${note.content}\`)">
          <h3>${note.title}</h3>
          <p>${note.content.substring(0, 80)}...</p>
  
          <button 
            onclick="event.stopPropagation(); deleteNote('${note._id}')">
            Delete
          </button>
        </div>
      `;
    });
  }

  let currentNoteId = null;

function openNote(id, title, content) {
  currentNoteId = id;

  document.getElementById("editTitle").value = title;
  document.getElementById("editContent").value = content;

  // Reset AI Summary state whenever note is opened
  document.getElementById("summaryContainer").classList.add("hidden");
  document.getElementById("summaryContent").innerHTML = "";

  // Reset AI Chat state
  document.getElementById("chatLog").innerHTML = "";
  document.getElementById("chatInput").value = "";

  document.getElementById("viewModal").classList.remove("hidden");
}

function closeView() {
    document.getElementById("viewModal").classList.add("hidden");
  }

  async function updateNote() {
    const title = document.getElementById("editTitle").value;
    const content = document.getElementById("editContent").value;
  
    await fetch(`http://127.0.0.1:5001/api/notes/${currentNoteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, content })
    });
  
    closeView();
    loadNotes();
  }

  async function deleteNote(id) {
    await fetch(`http://127.0.0.1:5001/api/notes/${id}`, {
      method: "DELETE"
    });
  
    loadNotes();
  }


// Summarize Note (AI Feature)
async function summarizeNote() {
  if (!currentNoteId) return;

  const summaryContainer = document.getElementById("summaryContainer");
  const summaryLoading = document.getElementById("summaryLoading");
  const summaryContent = document.getElementById("summaryContent");
  const summarizeBtn = document.getElementById("summarizeBtn");

  summaryContainer.classList.remove("hidden");
  summaryLoading.classList.remove("hidden");
  summaryContent.innerHTML = "";
  summarizeBtn.disabled = true;

  try {
    const res = await fetch(`http://127.0.0.1:5001/api/notes/${currentNoteId}/summarize`, {
      method: "POST"
    });
    const data = await res.json();

    summaryLoading.classList.add("hidden");
    summarizeBtn.disabled = false;

    if (data.success) {
      // Basic formatting for list items
      const formattedHTML = data.summary
        .replace(/\n\*/g, '<br/>•')
        .replace(/\n-/g, '<br/>•')
        .replace(/\n/g, '<br/>');
        
      summaryContent.innerHTML = `<strong>✨ AI Summary:</strong><br/>${formattedHTML}`;
    } else {
      summaryContent.innerHTML = `<span style="color:red">Error: ${data.message}</span>`;
    }
  } catch (err) {
    summaryLoading.classList.add("hidden");
    summarizeBtn.disabled = false;
    summaryContent.innerHTML = `<span style="color:red">Failed to connect to AI service.</span>`;
  }
}

// Chat with Note (AI Feature)
async function sendChatMessage() {
  if (!currentNoteId) return;

  const chatInput = document.getElementById("chatInput");
  const chatLog = document.getElementById("chatLog");
  const sendChatBtn = document.getElementById("sendChatBtn");
  
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;

  // Append User message
  chatLog.innerHTML += `<div class="chat-bubble chat-user">${userMessage}</div>`;
  chatInput.value = "";
  sendChatBtn.disabled = true;

  // Append Typing indicator
  const typingId = "typing-" + Date.now();
  chatLog.innerHTML += `<div id="${typingId}" class="chat-typing">AI is typing...</div>`;
  chatLog.scrollTop = chatLog.scrollHeight;

  try {
    const res = await fetch(`http://127.0.0.1:5001/api/notes/${currentNoteId}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userMessage })
    });
    const data = await res.json();
    
    // Remove typing indicator
    const typingElement = document.getElementById(typingId);
    if (typingElement) typingElement.remove();
    
    sendChatBtn.disabled = false;

    if (data.success) {
      const formattedHTML = data.aiResponse
        .replace(/\n\*/g, '<br/>•')
        .replace(/\n-/g, '<br/>•')
        .replace(/\n/g, '<br/>');
      chatLog.innerHTML += `<div class="chat-bubble chat-ai">${formattedHTML}</div>`;
    } else {
      chatLog.innerHTML += `<div class="chat-bubble chat-ai" style="color:red">Error: ${data.message}</div>`;
    }
    chatLog.scrollTop = chatLog.scrollHeight;
  } catch (err) {
    const typingElement = document.getElementById(typingId);
    if (typingElement) typingElement.remove();
    
    sendChatBtn.disabled = false;
    chatLog.innerHTML += `<div class="chat-bubble chat-ai" style="color:red">Failed to connect to AI service.</div>`;
    chatLog.scrollTop = chatLog.scrollHeight;
  }
}

// Add Note
async function addNote() {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  if (!title || !content) return;

  await fetch("http://127.0.0.1:5001/api/notes/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, title, content })
  });

  toggleModal();
  loadNotes();
}
function goToAddNote() {
    window.location.href = "addNote.html";
  }


// Modal
function toggleModal() {
  document.getElementById("modal").classList.toggle("hidden");
}


// Navigation
function goHome() {
  window.location.href = "home.html";
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}


// Init
loadNotes();