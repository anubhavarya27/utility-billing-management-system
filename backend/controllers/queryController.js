const pool = require("../config/database");

const executeQuery = async (req, res) => {
    try {
        const { query } = req.body;

        if (!query || !query.trim()) {
            return res.status(400).json({
                success: false,
                message: "SQL query is required",
            });
        }

        const [result, fields] = await pool.query(query);

        res.json({
            success: true,
            data: {
                result,
                fields: fields || [],
            },
        });
    } catch (error) {
        console.error("Query execution error:", error);

        res.status(400).json({
            success: false,
            message: error.sqlMessage || error.message,
            code: error.code || null,
            sqlState: error.sqlState || null,
        });
    }
};

module.exports = {
    executeQuery,
};