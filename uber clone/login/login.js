// Simulated user database for demonstration
const users = [
    { email: "user@example.com", password: "password123", token: "abc123xyz" },
    { email: "admin@example.com", password: "admin456", token: "def456uvw" }
];

// Handle form submission
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the form from submitting the default way

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");

    // Check if the user exists in the "database"
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        // Store user info in localStorage
        localStorage.setItem("userToken", user.token);
        localStorage.setItem("userEmail", user.email);

        // Redirect to the homepage or another page
        window.location.href = "http://127.0.0.1:5500/index.html";
    } else {
        // Display error message
        errorMessage.textContent = "Invalid email or password. Please try again.";
    }
});
