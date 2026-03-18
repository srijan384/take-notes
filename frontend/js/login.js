document.getElementById("loginForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("errorMsg");

  try {
    const res = await fetch("http://127.0.0.1:5001/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.success) {

      // ✅ Store full user (comes from backend)
      localStorage.setItem("user", JSON.stringify({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email
      }));

      window.location.href = "home.html";

    } else {
      errorMsg.textContent = data.message;
    }

  } catch (err) {
    errorMsg.textContent = "Server error";
  }
});