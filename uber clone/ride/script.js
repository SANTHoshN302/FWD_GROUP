let map;

function initMap() {
    // Set the initial map center to Bengaluru
    const initialLocation = { lat: 12.9716, lng: 77.5946 }; // Bengaluru, India
    map = new google.maps.Map(document.getElementById("map"), {
        center: initialLocation,
        zoom: 12,
        styles: [
            {
                featureType: "poi",
                stylers: [{ visibility: "off" }],
            },
            {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#f5f5f5" }],
            },
        ],
    });

    // Marker for the initial location
    new google.maps.Marker({
        position: initialLocation,
        map: map,
        title: "Bengaluru",
    });
}

// Button logic to show alert for prices
document.getElementById("see-prices").addEventListener("click", () => {
    const pickup = document.getElementById("pickup").value;
    const dropoff = document.getElementById("dropoff").value;

    if (pickup && dropoff) {
        alert(`Fetching prices from ${pickup} to ${dropoff}.`);
    } else {
        alert("Please fill in both pickup and dropoff locations.");
    }
});
document.querySelectorAll(".ride-options button").forEach((button) => {
    button.addEventListener("click", (event) => {
        document.querySelectorAll(".ride-options button").forEach((btn) =>
            btn.classList.remove("active-option")
        );
        event.target.classList.add("active-option");
        alert(`Mode switched to ${event.target.innerText}`);
    });
});

document.getElementById("see-prices").addEventListener("click", async () => {
    const pickup = document.getElementById("pickup").value;
    const dropoff = document.getElementById("dropoff").value;

    if (!pickup || !dropoff) {
        alert("Please fill in both pickup and dropoff locations.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/getDetails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                pickup,
                dropoff,
                mode: document.querySelector(".active-option").innerText.toLowerCase(),
            }),
        });

        const data = await response.json();

        if (data.error) {
            alert(data.error);
        } else {
            alert(`Price: ${data.price}\nDuration: ${data.duration}\nDistance: ${data.distance}`);
            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer();
            directionsRenderer.setMap(map);

            directionsService.route(
                {
                    origin: pickup,
                    destination: dropoff,
                    travelMode: "DRIVING",
                },
                (result, status) => {
                    if (status === "OK") {
                        directionsRenderer.setDirections(result);
                    } else {
                        alert("Could not fetch directions.");
                    }
                }
            );
        }
    } catch (err) {
        alert("Error fetching data from server.");
    }
});

// // Simulate a user authentication check (replace with real authentication logic)
// function isLoggedIn() {
//     // Replace with actual logic, e.g., check a token in localStorage or a session cookie
//     const userToken = localStorage.getItem('userToken');
//     return userToken !== null; // Return true if the user is logged in
// }

// // Redirect if not logged in
// function redirectToLogin() {
//     if (!isLoggedIn()) {
//         window.location.href = "../"; // Replace with your actual login page URL
//     }
// }

// // Call the function on page load
// redirectToLogin();
