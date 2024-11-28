const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const navLink = document.querySelector("#nav-links");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
  navLink.classList.toggle("active");
});

document.querySelectorAll(".nav-links").forEach((n) =>
  n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
    navLink.classList.remove("active");
  })
);

// Logout the user
document.getElementById("logoutBtn").addEventListener("click", function () {
  // Remove user data from localStorage
  localStorage.removeItem("userToken");
  localStorage.removeItem("userEmail");

  // Optionally, display a logout confirmation message
  alert("You have been logged out successfully!");

  // Redirect to the login page
  window.location.href = "http://127.0.0.1:5500/login/login1.html"; // Replace with your actual login page URL
});


