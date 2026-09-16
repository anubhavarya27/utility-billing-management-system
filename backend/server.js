const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Routes
const customerRoutes = require("./routes/customerRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const meterRoutes = require("./routes/meterRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const billRoutes = require("./routes/billRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Error handler
const errorHandler = require("./middleware/errorHandler");

const app = express();

const PORT = process.env.PORT || 5000;


// ================================
// Middleware
// ================================

app.use(cors());
app.use(express.json());


// ================================
// Root route
// ================================

app.get("/", (req, res) => {
    res.json({
        message: "Utility Billing Management System API is running"
    });
});


// ================================
// API Routes
// ================================

app.use("/api/customers", customerRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/meters", meterRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);


// ================================
// Error Handler
// ================================

app.use(errorHandler);


// ================================
// Start Server
// ================================

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});