document.getElementById("signupForm").addEventListener("submit", async function(e) {
    e.preventDefault();
  
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("errorMsg");
  
    try {
      const res = await fetch("http://127.0.0.1:5001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ firstName, lastName, email, password })
      });
  
      const data = await res.json();
  
      if (data.success) {
        // ✅ Show popup instead of alert
        const popup = document.getElementById("successPopup");
        popup.classList.remove("hidden");
  
        // Redirect after 2 sec
        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
  
      } else {
        errorMsg.textContent = data.message;
      }
  
    } catch (err) {
      errorMsg.textContent = "Server error";
    }
  });
  
  
  // 👁️ Show/Hide Password
  function togglePassword() {
    const passwordField = document.getElementById("password");
  
    if (passwordField.type === "password") {
      passwordField.type = "text";
    } else {
      passwordField.type = "password";
    }
  }