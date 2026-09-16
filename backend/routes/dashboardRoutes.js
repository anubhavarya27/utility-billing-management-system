const express = require("express");

const router = express.Router();

const {
    getDashboardSummary,
    getBillStatus,
    getPaymentMethods
} = require("../controllers/dashboardController");


// Dashboard summary
router.get("/summary", getDashboardSummary);

// Bill status
router.get("/bill-status", getBillStatus);

// Payment methods
router.get("/payment-methods", getPaymentMethods);


module.exports = router;