const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors()); // Enable CORS

const API_USERNAME = "varis"; // Your StoreHub subdomain
const API_PASSWORD = "6125587386e442aaab982e6bd5b71df0"; // Your StoreHub API token

// Proxy endpoint to get customer data
app.get("/api/customers", async (req, res) => {
  const phoneNumber = req.query.phone; // Get phone number from query params

  try {
    const response = await axios.get(
      `https://api.storehubhq.com/customers`,
      {
        auth: { username: API_USERNAME, password: API_PASSWORD },
      }
    );

    res.json(response.data); // Send API response back to frontend
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Start server on port 5000
app.listen(5000, () => console.log("Proxy server running on port 5000"));
