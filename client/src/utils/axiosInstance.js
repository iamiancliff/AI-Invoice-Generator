import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 seconds - reasonable timeout for API calls
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Log and validate base URL
if (import.meta.env.DEV) {
  console.log("[axios] base URL (dev):", BASE_URL);
} else {
  console.log("[axios] base URL (prod):", BASE_URL);
  // Warn if production is using localhost (configuration issue)
  if (BASE_URL.includes("localhost") || BASE_URL.includes("127.0.0.1")) {
    console.error(
      "⚠️ WARNING: Production build is using localhost URL!",
      "Set VITE_API_URL environment variable in Vercel to your Render backend URL."
    );
  }
}

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors globally with better messages
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.message || error.response.statusText;
      
      switch (status) {
        case 400:
          console.error("Bad request:", message);
          break;
        case 401:
          console.error("Unauthorized:", message);
          break;
        case 403:
          console.error("Forbidden:", message);
          break;
        case 404:
          console.error("Not found:", message || "The requested resource was not found");
          break;
        case 500:
          console.error("Server error:", message || "Internal server error. Please try again later.");
          break;
        case 503:
          console.error("Service unavailable:", message || "The service is temporarily unavailable. Please try again later.");
          break;
        default:
          console.error(`Error ${status}:`, message);
      }
    } else if (error.code === "ECONNABORTED") {
      // Request timeout
      console.error("Request timeout: The server took too long to respond. Please check your connection and try again.");
      error.message = "Request timeout. Please check your connection and try again.";
    } else if (error.code === "ERR_NETWORK" || error.message?.includes("Network Error")) {
      // Network error (server unreachable, CORS, etc.)
      const isLocalhost = BASE_URL.includes("localhost") || BASE_URL.includes("127.0.0.1");
      if (isLocalhost && import.meta.env.DEV) {
        console.error("Network error: Backend server is not running. Please start your backend server on", BASE_URL);
        error.message = "Backend server is not running. Please start the server and try again.";
      } else {
        console.error("Network error: Unable to reach the server. Please check your connection.");
        error.message = "Unable to connect to the server. Please check your internet connection.";
      }
    } else if (error.code === "ERR_CONNECTION_REFUSED" || error.message?.includes("CONNECTION_REFUSED")) {
      // Connection refused - server not running or wrong port
      const isLocalhost = BASE_URL.includes("localhost") || BASE_URL.includes("127.0.0.1");
      if (isLocalhost && import.meta.env.DEV) {
        console.error("Connection refused: Backend server is not running on", BASE_URL);
        error.message = "Backend server is not running. Please start the server on port 5000 and try again.";
      } else {
        console.error("Connection refused: The server refused the connection. It may be down or the URL is incorrect.");
        error.message = "Server connection refused. Please check if the server is running.";
      }
    } else if (error.request && !error.response) {
      // Request was made but no response received
      console.error("No response from server: The server may be down or unreachable.");
      error.message = "No response from server. Please try again later.";
    } else {
      console.error("Request error:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
