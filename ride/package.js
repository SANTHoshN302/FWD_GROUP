let map;
let directionsService;
let directionsRenderer;
const packageOptionsContainer = document.getElementById("package-options"); // Package options container

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

    // Event listener for calculating package delivery price
    document.getElementById("see-prices").addEventListener("click", displayPackageDelivery);
}

// Function to calculate package price based on distance and selected item
function calculatePackagePrice(distanceInKm, selectedItem) {
    const prices = {
        electronics: 50, // ₹50 per km for electronics
        "washing-machine": 70, // ₹70 per km for washing machine
        fridge: 80, // ₹80 per km for fridge
        other: 40, // ₹40 per km for other items
    };

    return prices[selectedItem] * distanceInKm;
}

// Function to display package delivery details
function displayPackageDelivery() {
    console.log("Display package delivery triggered");

    const pickup = document.getElementById("pickup").value;
    const dropoff = document.getElementById("dropoff").value;
    const selectedItem = document.getElementById("item").value;

    if (!pickup || !dropoff || !selectedItem) {
        alert("Please enter both Pickup and Dropoff locations and select an item.");
        return;
    }

    // Request route and calculate distance for package delivery
    const request = {
        origin: pickup,
        destination: dropoff,
        travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            const route = result.routes[0].legs[0];
            const distanceInKm = (route.distance.value / 1000).toFixed(2);

            // Calculate package delivery price based on selected item
            const price = calculatePackagePrice(distanceInKm, selectedItem);

            // Display the price for package delivery
            packageOptionsContainer.innerHTML = ""; // Clear existing options
            const packageOption = document.createElement("div");
            packageOption.className = "package-option";
            packageOption.innerHTML = `
                <div class="package-info">
                    <h3>Package: ${selectedItem}</h3>
                    <p>Distance: ${distanceInKm} km</p>
                    <p>Price: ₹${price}</p>
                </div>
            `;

            packageOption.addEventListener("click", () => confirmPackageDelivery(price, selectedItem));
            packageOptionsContainer.appendChild(packageOption);

            // Update route on the map
            directionsRenderer.setMap(map);
            directionsRenderer.setDirections(result);
        } else {
            alert("Could not calculate route. Please check your locations.");
        }
    });
}

// Function to confirm package delivery
function confirmPackageDelivery(price, item) {
    const confirmationMessage = document.createElement("div");
    confirmationMessage.className = "confirmation-message";
    confirmationMessage.textContent = `🎉 Delivery Confirmed for ${item}: ₹${price}. Your package is on the way!`;

    // Clear existing message and append the new one
    packageOptionsContainer.innerHTML = "";
    packageOptionsContainer.appendChild(confirmationMessage);

    // Show the message with a delay
    confirmationMessage.style.display = "block";

    setTimeout(() => {
        confirmationMessage.style.display = "none";
        alert(`Delivery details: ${item}, ₹${price}`);
    }, 5000); // Message disappears after 5 seconds
}
