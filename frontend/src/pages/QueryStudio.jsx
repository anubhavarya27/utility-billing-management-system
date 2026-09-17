import { useState } from "react";
import "../styles/query-studio.css";

const sampleQueries = [
    {
        name: "All customers",
        sql: "SELECT * FROM Customer;",
    },
    {
        name: "Bill status",
        sql: "SELECT bill_status, COUNT(*) AS count FROM Bill GROUP BY bill_status;",
    },
    {
        name: "Top consuming meters",
        sql: `SELECT meter_id,
       SUM(current_reading - previous_reading) AS total_consumption
FROM Bill
GROUP BY meter_id
ORDER BY total_consumption DESC
LIMIT 10;`,
    },
    {
        name: "Payment methods",
        sql: "SELECT payment_mode, COUNT(*) AS payment_count, SUM(amount) AS total_amount FROM Payment GROUP BY payment_mode;",
    },
];

const mockResults = [
    ["1", "Arun Kumar", "Chennai"],
    ["2", "Priya Sharma", "Chennai"],
    ["3", "Rahul Menon", "Chennai"],
    ["4", "Sneha Reddy", "Chennai"],
    ["5", "Karthik Raj", "Chennai"],
];

function QueryStudio() {
    const [query, setQuery] = useState(sampleQueries[0].sql);
    const [results, setResults] = useState([]);
    const [executed, setExecuted] = useState(false);

    function runQuery() {
        setExecuted(true);
        setResults(mockResults);
    }

    function loadQuery(sql) {
        setQuery(sql);
        setExecuted(false);
        setResults([]);
    }

    return (
        <div className="query-page">
            <div className="query-header">
                <div>
                    <span className="eyebrow">DATABASE TOOLS</span>
                    <h1>Query Studio</h1>
                    <p>
                        Explore the utility database using SQL.
                    </p>
                </div>

                <div className="query-mode">
                    <button className="active">SQL</button>
                    <button disabled title="Coming later">
                        NL → SQL
                    </button>
                </div>
            </div>

            <div className="query-layout">
                <aside className="query-sidebar">
                    <span className="query-sidebar-title">
                        SAVED QUERIES
                    </span>

                    {sampleQueries.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => loadQuery(item.sql)}
                        >
                            {item.name}
                        </button>
                    ))}

                    <div className="query-info">
                        <span>DATABASE</span>
                        <strong>utility_billing_db</strong>
                    </div>
                </aside>

                <main className="query-main">
                    <section className="editor-panel">
                        <div className="editor-header">
                            <span>QUERY EDITOR</span>

                            <button
                                className="run-button"
                                onClick={runQuery}
                            >
                                RUN QUERY
                            </button>
                        </div>

                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            spellCheck="false"
                        />
                    </section>

                    <section className="results-panel">
                        <div className="results-header">
                            <div>
                                <span>RESULTS</span>
                                <strong>
                                    {executed ? "5 rows" : "No execution"}
                                </strong>
                            </div>

                            {executed && (
                                <span className="success-label">
                                    QUERY COMPLETE
                                </span>
                            )}
                        </div>

                        {executed ? (
                            <table className="query-results">
                                <thead>
                                    <tr>
                                        <th>cust_id</th>
                                        <th>cust_name</th>
                                        <th>city</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {results.map((row) => (
                                        <tr key={row[0]}>
                                            <td>{row[0]}</td>
                                            <td>{row[1]}</td>
                                            <td>{row[2]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="results-empty">
                                Run a query to view results.
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}

export default QueryStudio;