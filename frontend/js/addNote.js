const user = JSON.parse(localStorage.getItem("user"));
const email = user.email;


// Save Note
async function saveNote() {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  if (!title || !content) {
    alert("Please fill all fields");
    return;
  }

  await fetch("http://127.0.0.1:5001/api/notes/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, title, content })
  });

  window.location.href = "notes.html";
}


// Back
function goBack() {
  window.location.href = "notes.html";
}