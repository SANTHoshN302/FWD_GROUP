const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/getDetails", async (req, res) => {
    const { pickup, dropoff, mode } = req.body;

    if (!pickup || !dropoff) {
        return res.status(400).json({ error: "Pickup and Dropoff are required." });
    }

    // Simulated pricing logic
    const distance = Math.random() * 10 + 5; // Random 5-15km
    const duration = distance * 2; // Rough estimate: 2 mins per km
    const price = mode === "ride" ? distance * 10 : distance * 15; // Higher price for "package"

    res.json({
        distance: `${distance.toFixed(2)} km`,
        duration: `${duration.toFixed(0)} minutes`,
        price: `$${price.toFixed(2)}`,
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
