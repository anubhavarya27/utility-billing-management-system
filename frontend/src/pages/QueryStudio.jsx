import { useState } from "react";
import { executeQuery } from "../services/api";
import "../styles/query-studio.css";


/* =========================================================
   SAVED QUERIES
   ========================================================= */

const sampleQueries = [
    {
        name: "All customers",
        sql: "SELECT * FROM Customer;",
    },

    {
        name: "Bill status",
        sql:
            "SELECT bill_status, COUNT(*) AS count FROM Bill GROUP BY bill_status;",
    },

    {
        name: "Customer + property join",
        sql: `SELECT
    c.cust_id,
    c.cust_name,
    p.property_name
FROM Customer c
JOIN Customer_Owns_Property cop
    ON c.cust_id = cop.cust_id
JOIN Property p
    ON cop.property_id = p.property_id;`,
    },

    {
        name: "Top consuming meters",
        sql: `SELECT
    meter_id,
    SUM(current_reading - previous_reading) AS total_consumption
FROM Bill
GROUP BY meter_id
ORDER BY total_consumption DESC
LIMIT 10;`,
    },

    {
        name: "Payment methods",
        sql: `SELECT
    payment_mode,
    COUNT(*) AS payment_count,
    SUM(amount) AS total_amount
FROM Payment
GROUP BY payment_mode;`,
    },

    {
        name: "Customer consumption",
        sql: `SELECT
    c.cust_name,
    SUM(
        b.current_reading - b.previous_reading
    ) AS total_consumption
FROM Customer c
JOIN Customer_Owns_Property cop
    ON c.cust_id = cop.cust_id
JOIN Property_Incorporate_Meter pim
    ON cop.property_id = pim.property_id
JOIN Bill b
    ON pim.meter_id = b.meter_id
GROUP BY c.cust_id, c.cust_name
ORDER BY total_consumption DESC;`,
    },
];


/* =========================================================
   MAIN COMPONENT
   ========================================================= */

function QueryStudio() {
    const [query, setQuery] = useState(
        sampleQueries[0].sql
    );

    const [result, setResult] = useState(null);
    const [executed, setExecuted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    /* =====================================================
       RUN QUERY
       ===================================================== */

    async function runQuery() {
        if (!query.trim()) {
            setError("Enter a SQL query first.");
            return;
        }

        setLoading(true);
        setExecuted(false);
        setError("");
        setResult(null);

        try {
            const data = await executeQuery(
                query.trim()
            );

            /*
             * Backend responses:
             *
             * READ:
             * {
             *   mode: "EXECUTED",
             *   queryType: "SELECT",
             *   rows: [...],
             *   fields: [...]
             * }
             *
             * WRITE:
             * {
             *   mode: "PENDING_APPROVAL",
             *   requestId: 12,
             *   queryType: "WRITE",
             *   status: "PENDING"
             * }
             */

            setResult(data);
            setExecuted(true);

        } catch (err) {
            console.error(
                "Query execution failed:",
                err
            );

            setError(
                err.message ||
                    "Query execution failed."
            );
        } finally {
            setLoading(false);
        }
    }


    /* =====================================================
       LOAD SAVED QUERY
       ===================================================== */

    function loadQuery(sql) {
        setQuery(sql);
        setExecuted(false);
        setResult(null);
        setError("");
    }


    const resultRows = getRows(result);

    const resultColumns = getColumns(
        result,
        resultRows
    );

    const isPending =
        result?.mode === "PENDING_APPROVAL";

    const isExecuted =
        result?.mode === "EXECUTED";

    const isRowResult =
        resultRows.length > 0 ||
        resultColumns.length > 0;


    return (
        <div className="query-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="query-header">

                <div>
                    <span className="eyebrow">
                        DATABASE TOOLS
                    </span>

                    <h1>Query Studio</h1>

                    <p>
                        Execute SQL directly against the
                        utility billing database.
                    </p>
                </div>


                <div className="query-mode">

                    <button className="active">
                        SQL
                    </button>

                    <button
                        disabled
                        title="Coming later"
                    >
                        NL → SQL
                    </button>

                </div>

            </div>


            {/* =================================================
                MAIN LAYOUT
            ================================================= */}

            <div className="query-layout">

                {/* =================================================
                    SIDEBAR
                ================================================= */}

                <aside className="query-sidebar">

                    <span className="query-sidebar-title">
                        SAVED QUERIES
                    </span>


                    {sampleQueries.map(
                        (item) => (
                            <button
                                key={item.name}
                                onClick={() =>
                                    loadQuery(
                                        item.sql
                                    )
                                }
                            >
                                {item.name}
                            </button>
                        )
                    )}


                    <div className="query-info">

                        <span>
                            DATABASE
                        </span>

                        <strong>
                            utility_billing_db
                        </strong>

                    </div>

                </aside>


                {/* =================================================
                    MAIN
                ================================================= */}

                <main className="query-main">


                    {/* =================================================
                        EDITOR
                    ================================================= */}

                    <section className="editor-panel">

                        <div className="editor-header">

                            <span>
                                QUERY EDITOR
                            </span>

                            <button
                                className="run-button"
                                onClick={runQuery}
                                disabled={loading}
                            >
                                {loading
                                    ? "RUNNING..."
                                    : "RUN QUERY"}
                            </button>

                        </div>


                        <textarea
                            value={query}
                            onChange={(event) =>
                                setQuery(
                                    event.target.value
                                )
                            }
                            spellCheck="false"
                            placeholder="Enter SQL query..."
                        />

                    </section>


                    {/* =================================================
                        RESULTS
                    ================================================= */}

                    <section className="results-panel">

                        <div className="results-header">

                            <div>

                                <span>
                                    RESULTS
                                </span>

                                <strong>

                                    {!executed
                                        ? "No execution"
                                        : loading
                                        ? "Executing..."
                                        : isPending
                                        ? "Pending approval"
                                        : getResultSummary(
                                              result
                                          )}

                                </strong>

                            </div>


                            {isExecuted &&
                                !error && (
                                    <span className="success-label">
                                        QUERY COMPLETE
                                    </span>
                                )}

                            {isPending &&
                                !error && (
                                    <span className="success-label">
                                        APPROVAL REQUIRED
                                    </span>
                                )}

                        </div>


                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {error ? (

                            <div className="results-error">

                                <strong>
                                    QUERY ERROR
                                </strong>

                                <span>
                                    {error}
                                </span>

                            </div>

                        ) : !executed ? (

                            <div className="results-empty">
                                Run a query to view
                                results.
                            </div>

                        ) : isPending ? (

                            <PendingApproval
                                result={result}
                            />

                        ) : isRowResult ? (

                            <ResultTable
                                rows={resultRows}
                                columns={resultColumns}
                            />

                        ) : (

                            <OperationResult
                                result={result}
                            />

                        )}

                    </section>

                </main>

            </div>

        </div>
    );
}


/* =========================================================
   PENDING APPROVAL RESULT
   ========================================================= */

function PendingApproval({ result }) {
    return (
        <div className="operation-result">

            <div className="operation-result-title">
                QUERY SUBMITTED FOR APPROVAL
            </div>


            <div className="operation-result-grid">

                <div>
                    <span>
                        REQUEST ID
                    </span>

                    <strong>
                        #{result?.requestId ?? "—"}
                    </strong>
                </div>


                <div>
                    <span>
                        QUERY TYPE
                    </span>

                    <strong>
                        {result?.queryType || "WRITE"}
                    </strong>
                </div>


                <div>
                    <span>
                        STATUS
                    </span>

                    <strong>
                        {result?.status || "PENDING"}
                    </strong>
                </div>

            </div>


            <div
                style={{
                    marginTop: "20px",
                    fontSize: "13px",
                    lineHeight: 1.6,
                    color: "#8f9a9b",
                }}
            >
                This query has not been executed.
                It has been sent to the approval queue
                for administrator review.
            </div>

        </div>
    );
}


/* =========================================================
   RESULT TABLE
   ========================================================= */

function ResultTable({
    rows,
    columns,
}) {
    return (
        <div className="query-results-wrapper">

            <table className="query-results">

                <thead>

                    <tr>

                        {columns.map(
                            (column) => (
                                <th key={column}>
                                    {column}
                                </th>
                            )
                        )}

                    </tr>

                </thead>


                <tbody>

                    {rows.map(
                        (row, rowIndex) => (

                            <tr
                                key={rowIndex}
                            >

                                {columns.map(
                                    (column) => (

                                        <td
                                            key={column}
                                        >
                                            {formatValue(
                                                row[
                                                    column
                                                ]
                                            )}
                                        </td>

                                    )
                                )}

                            </tr>

                        )
                    )}

                </tbody>

            </table>

        </div>
    );
}


/* =========================================================
   OPERATION RESULT
   ========================================================= */

function OperationResult({
    result,
}) {
    const operation =
        detectOperation(result);

    const affectedRows =
        getAffectedRows(result);

    const insertId =
        getInsertId(result);


    return (
        <div className="operation-result">

            <div className="operation-result-title">
                QUERY EXECUTED SUCCESSFULLY
            </div>


            <div className="operation-result-grid">

                <div>

                    <span>
                        OPERATION
                    </span>

                    <strong>
                        {operation}
                    </strong>

                </div>


                <div>

                    <span>
                        AFFECTED ROWS
                    </span>

                    <strong>
                        {affectedRows}
                    </strong>

                </div>


                {insertId !== null && (

                    <div>

                        <span>
                            INSERT ID
                        </span>

                        <strong>
                            {insertId}
                        </strong>

                    </div>

                )}

            </div>

        </div>
    );
}


/* =========================================================
   DATA HELPERS
   ========================================================= */

function getRows(result) {
    if (!result) {
        return [];
    }

    /*
     * Backend now returns:
     *
     * {
     *   rows: [...]
     * }
     */

    if (Array.isArray(result.rows)) {
        return result.rows;
    }

    return [];
}


function getColumns(
    result,
    rows
) {
    /*
     * If rows exist, use their object keys.
     */
    if (rows.length > 0) {
        return Object.keys(rows[0]);
    }


    /*
     * If query returns zero rows,
     * use MySQL field metadata.
     */
    if (
        result &&
        Array.isArray(result.fields) &&
        result.fields.length > 0
    ) {
        return result.fields
            .map(
                (field) =>
                    field.name ||
                    field.orgName ||
                    field.columnName
            )
            .filter(Boolean);
    }


    return [];
}


function getAffectedRows(result) {
    if (!result) {
        return 0;
    }

    /*
     * Backend returns affectedRows directly.
     */
    if (
        typeof result.affectedRows ===
        "number"
    ) {
        return result.affectedRows;
    }

    return 0;
}


function getInsertId(result) {
    if (!result) {
        return null;
    }

    /*
     * Backend returns insertId directly.
     */
    if (
        typeof result.insertId ===
            "number" &&
        result.insertId > 0
    ) {
        return result.insertId;
    }

    return null;
}


function detectOperation(result) {
    if (!result) {
        return "SQL";
    }

    /*
     * For the current backend,
     * READ operations don't reach this component
     * because rows/fields are rendered as a table.
     */

    if (typeof result.queryType === "string") {
        return result.queryType;
    }

    return "SQL";
}


function getResultSummary(result) {
    if (!result) {
        return "Query complete";
    }

    const rows = getRows(result);

    if (rows.length > 0) {
        return `${rows.length} rows`;
    }

    if (
        typeof result.affectedRows ===
            "number" &&
        result.affectedRows > 0
    ) {
        return `${result.affectedRows} affected`;
    }

    return "Query complete";
}


function formatValue(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return "—";
    }

    if (
        typeof value === "object"
    ) {
        return JSON.stringify(value);
    }

    return String(value);
}


export default QueryStudio;