const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "index.html";
}

// Show name
document.getElementById("welcomeText").innerText =
  `Welcome, ${user.firstName}`;

// Show email
document.getElementById("userEmail").innerText = user.email;


// Navigate
function goToNotes() {
  window.location.href = "notes.html";
}

// Logout
function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}