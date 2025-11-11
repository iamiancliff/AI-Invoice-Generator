require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require('./routes/authRoutes')
const invoiceRoutes = require('./routes/invoiceRoutes')
const aiRoutes = require('./routes/aiRoutes')
const reportRoutes = require('./routes/reportRoutes')

const app = express();

// Middleware to handle CORS
// In production, set ALLOWED_ORIGINS env var with your Vercel domain (e.g., "https://ai-invoice-generator.app,https://www.ai-invoice-generator.app")
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : null; // If not set, allow all origins (development mode)

app.use(
  cors({
    origin: allowedOrigins || true, // Allow all if ALLOWED_ORIGINS not set, otherwise use the list
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect Database
connectDB();

// Middleware
app.use(express.json());

// Routes Here
app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/reports", reportRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));