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