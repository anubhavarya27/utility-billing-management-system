const pool = require("../config/database");


// ============================================================
// SQL CLASSIFICATION HELPERS
// ============================================================

const WRITE_KEYWORDS = new Set([
    "INSERT",
    "UPDATE",
    "DELETE",
    "REPLACE",
    "MERGE",
    "CREATE",
    "ALTER",
    "DROP",
    "TRUNCATE",
    "RENAME",
    "GRANT",
    "REVOKE",
    "CALL",
    "LOAD",
    "IMPORT"
]);

const READ_KEYWORDS = new Set([
    "SELECT",
    "SHOW",
    "DESCRIBE",
    "DESC",
    "EXPLAIN"
]);


// Remove SQL comments while preserving quoted strings.
const stripSqlComments = (sql) => {
    let result = "";
    let i = 0;

    let inSingleQuote = false;
    let inDoubleQuote = false;
    let inBacktick = false;

    while (i < sql.length) {
        const char = sql[i];
        const next = sql[i + 1];

        // Single-quoted string
        if (inSingleQuote) {
            result += char;

            if (char === "\\" && next) {
                result += next;
                i += 2;
                continue;
            }

            if (char === "'") {
                inSingleQuote = false;
            }

            i++;
            continue;
        }

        // Double-quoted string
        if (inDoubleQuote) {
            result += char;

            if (char === "\\" && next) {
                result += next;
                i += 2;
                continue;
            }

            if (char === '"') {
                inDoubleQuote = false;
            }

            i++;
            continue;
        }

        // Backtick identifier
        if (inBacktick) {
            result += char;

            if (char === "`") {
                inBacktick = false;
            }

            i++;
            continue;
        }

        // Start single quote
        if (char === "'") {
            inSingleQuote = true;
            result += char;
            i++;
            continue;
        }

        // Start double quote
        if (char === '"') {
            inDoubleQuote = true;
            result += char;
            i++;
            continue;
        }

        // Start backtick
        if (char === "`") {
            inBacktick = true;
            result += char;
            i++;
            continue;
        }

        // /* block comment */
        if (char === "/" && next === "*") {
            i += 2;

            while (i < sql.length) {
                if (sql[i] === "*" && sql[i + 1] === "/") {
                    i += 2;
                    break;
                }

                i++;
            }

            result += " ";
            continue;
        }

        // -- comment
        if (
            char === "-" &&
            next === "-" &&
            (i + 2 >= sql.length ||
                /\s/.test(sql[i + 2]))
        ) {
            i += 2;

            while (
                i < sql.length &&
                sql[i] !== "\n"
            ) {
                i++;
            }

            result += " ";
            continue;
        }

        // # comment
        if (char === "#") {
            i++;

            while (
                i < sql.length &&
                sql[i] !== "\n"
            ) {
                i++;
            }

            result += " ";
            continue;
        }

        result += char;
        i++;
    }

    return result;
};


// Split multiple SQL statements on semicolons,
// but do not split semicolons inside strings.
const splitSqlStatements = (sql) => {
    const statements = [];

    let current = "";

    let inSingleQuote = false;
    let inDoubleQuote = false;
    let inBacktick = false;

    for (let i = 0; i < sql.length; i++) {
        const char = sql[i];

        if (inSingleQuote) {
            current += char;

            if (char === "\\" && sql[i + 1]) {
                current += sql[i + 1];
                i++;
                continue;
            }

            if (char === "'") {
                inSingleQuote = false;
            }

            continue;
        }

        if (inDoubleQuote) {
            current += char;

            if (char === "\\" && sql[i + 1]) {
                current += sql[i + 1];
                i++;
                continue;
            }

            if (char === '"') {
                inDoubleQuote = false;
            }

            continue;
        }

        if (inBacktick) {
            current += char;

            if (char === "`") {
                inBacktick = false;
            }

            continue;
        }

        if (char === "'") {
            inSingleQuote = true;
            current += char;
            continue;
        }

        if (char === '"') {
            inDoubleQuote = true;
            current += char;
            continue;
        }

        if (char === "`") {
            inBacktick = true;
            current += char;
            continue;
        }

        if (char === ";") {
            if (current.trim()) {
                statements.push(current.trim());
            }

            current = "";
            continue;
        }

        current += char;
    }

    if (current.trim()) {
        statements.push(current.trim());
    }

    return statements;
};


// Get SQL tokens outside quoted strings.
const getSqlTokens = (sql) => {
    const tokens = [];

    let current = "";

    let inSingleQuote = false;
    let inDoubleQuote = false;
    let inBacktick = false;

    const pushCurrent = () => {
        if (current) {
            tokens.push(current.toUpperCase());
            current = "";
        }
    };

    for (let i = 0; i < sql.length; i++) {
        const char = sql[i];

        if (inSingleQuote) {
            if (char === "\\" && sql[i + 1]) {
                i++;
                continue;
            }

            if (char === "'") {
                inSingleQuote = false;
            }

            continue;
        }

        if (inDoubleQuote) {
            if (char === "\\" && sql[i + 1]) {
                i++;
                continue;
            }

            if (char === '"') {
                inDoubleQuote = false;
            }

            continue;
        }

        if (inBacktick) {
            if (char === "`") {
                inBacktick = false;
            }

            continue;
        }

        if (char === "'") {
            pushCurrent();
            inSingleQuote = true;
            continue;
        }

        if (char === '"') {
            pushCurrent();
            inDoubleQuote = true;
            continue;
        }

        if (char === "`") {
            pushCurrent();
            inBacktick = true;
            continue;
        }

        if (/[A-Za-z0-9_$]/.test(char)) {
            current += char;
        } else {
            pushCurrent();
        }
    }

    pushCurrent();

    return tokens;
};


// Determine the main SQL command.
// Handles WITH ... SELECT and WITH ... INSERT/UPDATE/DELETE.
const getMainKeyword = (sql) => {
    const tokens = getSqlTokens(sql);

    if (tokens.length === 0) {
        return null;
    }

    if (tokens[0] !== "WITH") {
        return tokens[0];
    }

    let depth = 0;
    let seenWith = false;

    for (const token of tokens) {
        if (token === "WITH" && !seenWith) {
            seenWith = true;
            continue;
        }

        // Parentheses are not included by getSqlTokens,
        // so use a simpler fallback for WITH queries below.
    }

    // For WITH queries, locate the first main statement keyword
    // after the CTE definitions.
    const normalized = sql
        .replace(/\s+/g, " ")
        .trim()
        .toUpperCase();

    let parentheses = 0;
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let inBacktick = false;

    for (let i = 0; i < normalized.length; i++) {
        const char = normalized[i];

        if (inSingleQuote) {
            if (char === "'" && normalized[i - 1] !== "\\") {
                inSingleQuote = false;
            }
            continue;
        }

        if (inDoubleQuote) {
            if (char === '"' && normalized[i - 1] !== "\\") {
                inDoubleQuote = false;
            }
            continue;
        }

        if (inBacktick) {
            if (char === "`") {
                inBacktick = false;
            }
            continue;
        }

        if (char === "'") {
            inSingleQuote = true;
            continue;
        }

        if (char === '"') {
            inDoubleQuote = true;
            continue;
        }

        if (char === "`") {
            inBacktick = true;
            continue;
        }

        if (char === "(") {
            parentheses++;
            continue;
        }

        if (char === ")") {
            parentheses--;
            continue;
        }

        if (parentheses === 0) {
            const remaining = normalized.substring(i);

            const match = remaining.match(
                /^(SELECT|INSERT|UPDATE|DELETE|REPLACE|MERGE|CREATE|ALTER|DROP|TRUNCATE|RENAME|GRANT|REVOKE|CALL|LOAD|IMPORT)\b/
            );

            if (match) {
                return match[1];
            }
        }
    }

    return "UNKNOWN";
};


// Classify one statement.
const classifyStatement = (statement) => {
    const cleaned = stripSqlComments(statement).trim();

    if (!cleaned) {
        return "READ";
    }

    const keyword = getMainKeyword(cleaned);

    if (WRITE_KEYWORDS.has(keyword)) {
        return "WRITE";
    }

    if (READ_KEYWORDS.has(keyword)) {
        return "READ";
    }

    return "WRITE";
};


// Classify the entire submission.
const classifySql = (sql) => {
    const statements = splitSqlStatements(sql);

    if (statements.length === 0) {
        return {
            queryType: "WRITE",
            statements: []
        };
    }

    const classifications = statements.map(
        classifyStatement
    );

    const hasWrite = classifications.includes("WRITE");

    return {
        queryType: hasWrite ? "WRITE" : "SELECT",
        statements
    };
};


// ============================================================
// FORMAT EXECUTION RESULT
// ============================================================

const formatExecutionResult = (results, fields) => {
    const resultArray = Array.isArray(results)
        ? results
        : [results];

    const fieldArray = Array.isArray(fields)
        ? fields
        : [];

    let affectedRows = 0;
    let insertId = null;
    const rows = [];
    const fieldInfo = [];

    resultArray.forEach((result, index) => {
        if (Array.isArray(result)) {
            rows.push(result);

            if (fieldArray[index]) {
                fieldInfo.push(fieldArray[index]);
            }
        } else if (result) {
            affectedRows += Number(
                result.affectedRows || 0
            );

            if (
                insertId === null &&
                result.insertId !== undefined
            ) {
                insertId = result.insertId;
            }
        }
    });

    return {
        rows,
        fields: fieldInfo,
        affectedRows,
        insertId
    };
};


// ============================================================
// EXECUTE READ-ONLY QUERY
// ============================================================

// POST /api/query
const executeQuery = async (req, res) => {
    try {
        const { query } = req.body;

        if (
            typeof query !== "string" ||
            !query.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "SQL query is required"
            });
        }

        const classification = classifySql(query);

        // --------------------------------------------------------
        // WRITE QUERY
        // --------------------------------------------------------

        if (classification.queryType === "WRITE") {
            const [result] = await pool.query(
                `INSERT INTO QUERY_REQUEST (
                    submitted_by,
                    sql_query,
                    query_type,
                    status
                )
                VALUES (?, ?, 'WRITE', 'PENDING')`,
                [
                    req.user.id,
                    query.trim()
                ]
            );

            return res.status(202).json({
                success: true,
                data: {
                    mode: "PENDING_APPROVAL",
                    requestId: result.insertId,
                    queryType: "WRITE",
                    status: "PENDING"
                }
            });
        }

        // --------------------------------------------------------
        // READ-ONLY QUERY
        // --------------------------------------------------------

        const [result, fields] = await pool.query(
            query
        );

        const formatted =
            formatExecutionResult(
                result,
                fields
            );

        return res.json({
            success: true,
            data: {
                mode: "EXECUTED",
                queryType: "SELECT",
                rows: formatted.rows,
                fields: formatted.fields,
                affectedRows:
                    formatted.affectedRows,
                insertId:
                    formatted.insertId
            }
        });
    } catch (error) {
        console.error(
            "Query execution error:",
            error
        );

        return res.status(400).json({
            success: false,
            message:
                error.sqlMessage ||
                error.message ||
                "Query execution failed",
            code: error.code || null
        });
    }
};


// ============================================================
// GET QUERY REQUESTS
// ============================================================

// GET /api/query/requests
const getQueryRequests = async (req, res) => {
    try {
        let sql = `
            SELECT
                qr.request_id,
                qr.submitted_by,
                submitter.username AS submitted_by_name,
                qr.sql_query,
                qr.query_type,
                qr.status,
                qr.submitted_at,
                qr.reviewed_by,
                reviewer.username AS reviewed_by_name,
                qr.reviewed_at,
                qr.rejection_reason,
                qr.execution_result
            FROM QUERY_REQUEST qr
            INNER JOIN users submitter
                ON qr.submitted_by = submitter.user_id
            LEFT JOIN users reviewer
                ON qr.reviewed_by = reviewer.user_id
        `;

        const params = [];

        // USERs can see only their own requests.
        // ADMINs can see all requests.
        if (req.user.role !== "ADMIN") {
            sql += `
                WHERE qr.submitted_by = ?
            `;

            params.push(req.user.id);
        }

        sql += `
            ORDER BY qr.submitted_at DESC
        `;

        const [rows] = await pool.query(
            sql,
            params
        );

        return res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error(
            "Error getting query requests:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to get query requests"
        });
    }
};


// ============================================================
// GET ONE QUERY REQUEST
// ============================================================

// GET /api/query/requests/:id
const getQueryRequestById = async (
    req,
    res
) => {
    try {
        const requestId =
            Number(req.params.id);

        if (!Number.isInteger(requestId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request ID"
            });
        }

        let sql = `
            SELECT
                qr.request_id,
                qr.submitted_by,
                submitter.username AS submitted_by_name,
                qr.sql_query,
                qr.query_type,
                qr.status,
                qr.submitted_at,
                qr.reviewed_by,
                reviewer.username AS reviewed_by_name,
                qr.reviewed_at,
                qr.rejection_reason,
                qr.execution_result
            FROM QUERY_REQUEST qr
            INNER JOIN users submitter
                ON qr.submitted_by = submitter.user_id
            LEFT JOIN users reviewer
                ON qr.reviewed_by = reviewer.user_id
            WHERE qr.request_id = ?
        `;

        const params = [requestId];

        if (req.user.role !== "ADMIN") {
            sql += `
                AND qr.submitted_by = ?
            `;

            params.push(req.user.id);
        }

        const [rows] = await pool.query(
            sql,
            params
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "Query request not found"
            });
        }

        return res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error(
            "Error getting query request:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to get query request"
        });
    }
};


// ============================================================
// APPROVE QUERY REQUEST
// ============================================================

// POST /api/query/requests/:id/approve
const approveQueryRequest = async (
    req,
    res
) => {
    let connection;

    try {
        const requestId =
            Number(req.params.id);

        if (!Number.isInteger(requestId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request ID"
            });
        }

        connection =
            await pool.getConnection();

        // Lock the request while reviewing it.
        await connection.beginTransaction();

        const [requests] =
            await connection.query(
                `
                SELECT
                    request_id,
                    submitted_by,
                    sql_query,
                    query_type,
                    status
                FROM QUERY_REQUEST
                WHERE request_id = ?
                FOR UPDATE
                `,
                [requestId]
            );

        if (requests.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message:
                    "Query request not found"
            });
        }

        const request = requests[0];

        if (request.status !== "PENDING") {
            await connection.rollback();

            return res.status(409).json({
                success: false,
                message:
                    `Request cannot be approved because its current status is ${request.status}`
            });
        }

        // Re-classify the SQL on the server before execution.
        const classification =
            classifySql(request.sql_query);

        if (classification.queryType !== "WRITE") {
            await connection.rollback();

            return res.status(400).json({
                success: false,
                message:
                    "Only write queries can be approved"
            });
        }

        // PENDING -> APPROVED
        await connection.query(
            `
            UPDATE QUERY_REQUEST
            SET
                status = 'APPROVED',
                reviewed_by = ?,
                reviewed_at = CURRENT_TIMESTAMP
            WHERE request_id = ?
            `,
            [
                req.user.id,
                requestId
            ]
        );

        // APPROVED -> EXECUTING
        await connection.query(
            `
            UPDATE QUERY_REQUEST
            SET status = 'EXECUTING'
            WHERE request_id = ?
            `,
            [requestId]
        );

        const statements =
            classification.statements;

        // Determine whether this is a pure DML batch.
        const dmlKeywords = new Set([
            "INSERT",
            "UPDATE",
            "DELETE",
            "REPLACE",
            "MERGE"
        ]);

        const isDmlOnly = statements.every(
            (statement) => {
                const keyword =
                    getMainKeyword(
                        stripSqlComments(
                            statement
                        )
                    );

                return dmlKeywords.has(
                    keyword
                );
            }
        );

        let executionResult = null;

        if (isDmlOnly) {
            // ----------------------------------------------------
            // DML BATCH: TRANSACTION
            // ----------------------------------------------------

            await connection.beginTransaction();

            try {
                const statementResults = [];

                for (const statement of statements) {
                    const [result] =
                        await connection.query(
                            statement
                        );

                    statementResults.push({
                        affectedRows:
                            result.affectedRows || 0,
                        insertId:
                            result.insertId || 0
                    });
                }

                await connection.commit();

                executionResult = {
                    statements:
                        statementResults,
                    affectedRows:
                        statementResults.reduce(
                            (
                                total,
                                item
                            ) =>
                                total +
                                Number(
                                    item.affectedRows
                                ),
                            0
                        )
                };
            } catch (executionError) {
                await connection.rollback();

                await pool.query(
                    `
                    UPDATE QUERY_REQUEST
                    SET
                        status = 'FAILED',
                        execution_result = ?
                    WHERE request_id = ?
                    `,
                    [
                        JSON.stringify({
                            success: false,
                            message:
                                executionError.sqlMessage ||
                                executionError.message,
                            code:
                                executionError.code ||
                                null
                        }),
                        requestId
                    ]
                );

                return res.status(400).json({
                    success: false,
                    message:
                        executionError.sqlMessage ||
                        executionError.message ||
                        "Query execution failed",
                    code:
                        executionError.code ||
                        null,
                    data: {
                        requestId,
                        status: "FAILED"
                    }
                });
            }
        } else {
            // ----------------------------------------------------
            // DDL / MIXED WRITE: EXECUTE WITHOUT CLAIMING
            // TRANSACTIONAL ROLLBACK BEHAVIOR
            // ----------------------------------------------------

            const statementResults = [];

            try {
                for (const statement of statements) {
                    const [result] =
                        await connection.query(
                            statement
                        );

                    statementResults.push({
                        affectedRows:
                            result.affectedRows || 0,
                        insertId:
                            result.insertId || 0,
                        warningCount:
                            result.warningCount || 0
                    });
                }

                executionResult = {
                    statements:
                        statementResults,
                    affectedRows:
                        statementResults.reduce(
                            (
                                total,
                                item
                            ) =>
                                total +
                                Number(
                                    item.affectedRows
                                ),
                            0
                        )
                };
            } catch (executionError) {
                executionResult = {
                    success: false,
                    message:
                        executionError.sqlMessage ||
                        executionError.message,
                    code:
                        executionError.code ||
                        null
                };

                await connection.rollback().catch(
                    () => {}
                );

                await pool.query(
                    `
                    UPDATE QUERY_REQUEST
                    SET
                        status = 'FAILED',
                        execution_result = ?
                    WHERE request_id = ?
                    `,
                    [
                        JSON.stringify(
                            executionResult
                        ),
                        requestId
                    ]
                );

                return res.status(400).json({
                    success: false,
                    message:
                        executionError.sqlMessage ||
                        executionError.message ||
                        "Query execution failed",
                    code:
                        executionError.code ||
                        null,
                    data: {
                        requestId,
                        status: "FAILED"
                    }
                });
            }
        }

        // Record successful execution.
        await connection.query(
            `
            UPDATE QUERY_REQUEST
            SET
                status = 'COMPLETED',
                execution_result = ?
            WHERE request_id = ?
            `,
            [
                JSON.stringify(
                    executionResult
                ),
                requestId
            ]
        );

        await connection.commit();

        return res.json({
            success: true,
            data: {
                mode: "EXECUTED",
                requestId,
                status: "COMPLETED",
                affectedRows:
                    executionResult.affectedRows ||
                    0,
                executionResult
            }
        });
    } catch (error) {
        if (connection) {
            await connection.rollback().catch(
                () => {}
            );
        }

        console.error(
            "Error approving query request:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.sqlMessage ||
                error.message ||
                "Failed to approve query request",
            code: error.code || null
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};


// ============================================================
// REJECT QUERY REQUEST
// ============================================================

// POST /api/query/requests/:id/reject
const rejectQueryRequest = async (
    req,
    res
) => {
    try {
        const requestId =
            Number(req.params.id);

        if (!Number.isInteger(requestId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request ID"
            });
        }

        const rejectionReason =
            req.body &&
            req.body.rejectionReason
                ? String(
                    req.body.rejectionReason
                ).trim()
                : null;

        const [result] = await pool.query(
            `
            UPDATE QUERY_REQUEST
            SET
                status = 'REJECTED',
                reviewed_by = ?,
                reviewed_at = CURRENT_TIMESTAMP,
                rejection_reason = ?
            WHERE
                request_id = ?
                AND status = 'PENDING'
            `,
            [
                req.user.id,
                rejectionReason,
                requestId
            ]
        );

        if (result.affectedRows === 0) {
            const [requests] =
                await pool.query(
                    `
                    SELECT
                        request_id,
                        status
                    FROM QUERY_REQUEST
                    WHERE request_id = ?
                    `,
                    [requestId]
                );

            if (requests.length === 0) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Query request not found"
                });
            }

            return res.status(409).json({
                success: false,
                message:
                    `Request cannot be rejected because its current status is ${requests[0].status}`
            });
        }

        return res.json({
            success: true,
            data: {
                requestId,
                status: "REJECTED",
                rejectionReason
            }
        });
    } catch (error) {
        console.error(
            "Error rejecting query request:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to reject query request"
        });
    }
};


module.exports = {
    executeQuery,
    getQueryRequests,
    getQueryRequestById,
    approveQueryRequest,
    rejectQueryRequest
};