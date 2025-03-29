import axios from "axios";

// API Credentials (Replace with actual credentials)
const API_USERNAME = "varis"; // Your StoreHub subdomain
const API_PASSWORD = "6125587386e442aaab982e6bd5b71df0"; // Your API token

// Create Axios instance with authentication
const api = axios.create({
  baseURL: "https://api.storehubhq.com",
  headers: {
    "Content-Type": "application/json",
  },
  auth: {
    username: API_USERNAME,
    password: API_PASSWORD,
  },
});

export default api;
