let map;
let directionsService;
let directionsRenderer;
const rideOptionsContainer = document.getElementById("ride-options"); // Fix the ID here

function initMap() {
    const initialLocation = { lat: 20.5937, lng: 78.9629 }; // Center map on India
    map = new google.maps.Map(document.getElementById("map"), {
        center: initialLocation,
        zoom: 5,
    });

    // Initialize Directions API
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    // Initialize autocomplete for inputs
    const pickupInput = document.getElementById("pickup");
    const dropoffInput = document.getElementById("dropoff");

    const pickupAutocomplete = new google.maps.places.Autocomplete(pickupInput, {
        types: ["geocode"],
        componentRestrictions: { country: "in" },
    });

    const dropoffAutocomplete = new google.maps.places.Autocomplete(dropoffInput, {
        types: ["geocode"],
        componentRestrictions: { country: "in" },
    });

    // Event listener for calculating route
    document.getElementById("see-prices").addEventListener("click", displayRides);
}

function calculatePrices(distanceInKm) {
    return [
        {
            type: "RideX Go",
            eta: "4 mins",
            price: `₹${(distanceInKm * 12).toFixed(2)}`, // ₹12 per km
            description: "Affordable compact rides",
        },
        {
            type: "Premier",
            eta: "5 mins",
            price: `₹${(distanceInKm * 15).toFixed(2)}`, // ₹15 per km
            description: "Comfortable sedans, top-quality drivers",
        },
        {
            type: "RideXL",
            eta: "5 mins",
            price: `₹${(distanceInKm * 20).toFixed(2)}`, // ₹20 per km
            description: "Comfortable SUVs",
        },
    ];
}

function displayRides() {
    const pickup = document.getElementById("pickup").value;
    const dropoff = document.getElementById("dropoff").value;

    if (!pickup || !dropoff) {
        alert("Please enter both Pickup and Dropoff locations.");
        return;
    }

    if (!rideOptionsContainer) {
        console.error("Ride options container not found in the DOM.");
        return;
    }

    // Request route and calculate distance
    const request = {
        origin: pickup,
        destination: dropoff,
        travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            const route = result.routes[0].legs[0];
            const distanceInKm = (route.distance.value / 1000).toFixed(2);

            // Calculate ride options dynamically based on distance
            const rides = calculatePrices(distanceInKm);

            // Clear and populate ride options
            rideOptionsContainer.innerHTML = ""; // Clear existing rides
            rides.forEach((ride) => {
                const rideOption = document.createElement("div");
                rideOption.className = "ride-option";

                rideOption.innerHTML = `
                    <div class="ride-info">
                        <h3>${ride.type}</h3>
                        <p>${ride.description}</p>
                        <p>ETA: ${ride.eta}</p>
                    </div>
                    <div class="price">${ride.price}</div>
                `;

                rideOption.addEventListener("click", () => bookRide(ride));
                rideOptionsContainer.appendChild(rideOption);
            });

            // Update route on the map
            directionsRenderer.setMap(map);
            directionsRenderer.setDirections(result);
        } else {
            alert("Could not calculate route. Please check your locations.");
        }
    });
}

function bookRide(selectedRide) {
    const bookingMessage = document.createElement("div");
    bookingMessage.className = "booking-message";
    bookingMessage.textContent = `🎉 Ride booked successfully: ${selectedRide.type} for ${selectedRide.price}. Enjoy your trip!`;

    // Clear existing message and append the new one
    rideOptionsContainer.innerHTML = "";
    rideOptionsContainer.appendChild(bookingMessage);

    // Show the message with a delay
    bookingMessage.style.display = "block";

    setTimeout(() => {
        bookingMessage.style.display = "none";
        alert(`Ride details: ${selectedRide.type}, ${selectedRide.price}`);
    }, 5000); // Message disappears after 5 seconds
}
