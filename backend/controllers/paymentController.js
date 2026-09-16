const pool = require("../config/database");

// GET all payments
const getPayments = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT
                bill_id,
                payment_sequence,
                payment_id,
                payment_date,
                amount,
                payment_mode,
                payment_due_date
             FROM PAYMENT`
        );

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error("Error fetching payments:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch payments"
        });
    }
};

// GET payment by payment_id
const getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Payment ID is required"
            });
        }

        const [rows] = await pool.query(
            `SELECT
                bill_id,
                payment_sequence,
                payment_id,
                payment_date,
                amount,
                payment_mode,
                payment_due_date
             FROM PAYMENT
             WHERE payment_id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error("Error fetching payment:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch payment"
        });
    }
};

module.exports = {
    getPayments,
    getPaymentById
};