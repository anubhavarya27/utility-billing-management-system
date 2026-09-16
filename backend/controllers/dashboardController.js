const pool = require("../config/database");

// GET dashboard summary
const getDashboardSummary = async (req, res) => {
    try {
        const [customerResult] = await pool.query(
            `SELECT COUNT(*) AS total_customers
             FROM CUSTOMER`
        );

        const [propertyResult] = await pool.query(
            `SELECT COUNT(*) AS total_properties
             FROM PROPERTY`
        );

        const [meterResult] = await pool.query(
            `SELECT COUNT(*) AS total_meters
             FROM METER`
        );

        const [billResult] = await pool.query(
            `SELECT COUNT(*) AS total_bills
             FROM BILL`
        );

        const [paymentResult] = await pool.query(
            `SELECT COALESCE(SUM(amount), 0) AS total_revenue
             FROM PAYMENT`
        );

        res.json({
            success: true,
            data: {
                total_customers: customerResult[0].total_customers,
                total_properties: propertyResult[0].total_properties,
                total_meters: meterResult[0].total_meters,
                total_bills: billResult[0].total_bills,
                total_revenue: paymentResult[0].total_revenue
            }
        });
    } catch (error) {
        console.error("Error fetching dashboard summary:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard summary",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined
        });
    }
};

// GET bill status summary
const getBillStatus = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT
                bill_status,
                COUNT(*) AS count
             FROM BILL
             GROUP BY bill_status`
        );

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error("Error fetching bill status:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch bill status",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined
        });
    }
};

// GET payment method summary
const getPaymentMethods = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT
                payment_mode,
                COUNT(*) AS count,
                COALESCE(SUM(amount), 0) AS total_amount
             FROM PAYMENT
             GROUP BY payment_mode`
        );

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error("Error fetching payment methods:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch payment methods",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined
        });
    }
};

module.exports = {
    getDashboardSummary,
    getBillStatus,
    getPaymentMethods
};