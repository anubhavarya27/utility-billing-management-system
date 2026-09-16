import {
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

import "../styles/dashboard.css";

const summary = {
    total_customers: 10,
    total_properties: 6,
    total_meters: 10,
    total_bills: 30,
    total_revenue: 18505,
};

const billStatus = [
    { bill_status: "Paid", count: 19 },
    { bill_status: "Pending", count: 7 },
    { bill_status: "Overdue", count: 3 },
    { bill_status: "Partially Paid", count: 1 },
];

const paymentMethods = [
    { payment_mode: "UPI", count: 7, total_amount: 7400 },
    { payment_mode: "Card", count: 7, total_amount: 10980 },
    { payment_mode: "Cash", count: 5, total_amount: 3795 },
];

const consumptionData = [
    { month: "JAN", consumption: 2100 },
    { month: "FEB", consumption: 2280 },
    { month: "MAR", consumption: 2450 },
];

const revenueData = [
    { month: "JAN", revenue: 0.63 },
    { month: "FEB", revenue: 0.88 },
    { month: "MAR", revenue: 0.94 },
];

const recentRecords = [
    ["BILL-5001", "Arun Kumar", "₹1,275", "PAID"],
    ["BILL-5002", "Arun Kumar", "₹1,275", "PAID"],
    ["BILL-5003", "Arun Kumar", "₹1,360", "PENDING"],
    ["PAY-9001", "Arun Kumar", "₹1,320", "CARD"],
    ["BILL-5006", "Priya Sharma", "₹780", "OVERDUE"],
    ["MTR-1003", "Rahul Menon", "1,750 kWh", "OK"],
];

function Dashboard() {
    const totalPayments = paymentMethods.reduce(
        (sum, item) => sum + item.count,
        0
    );

    const paymentPercentage = (count) =>
        totalPayments
            ? Math.round((count / totalPayments) * 100)
            : 0;

    const billTotal = billStatus.reduce(
        (sum, item) => sum + item.count,
        0
    );

    return (
        <div className="dashboard">
            {/* TOP BAR */}
            <div className="dashboard-topbar">
                <div className="billing-cycle">
                    <span>Billing cycle</span>
                    <strong>March 2025</strong>
                    <span>· Utility billing system</span>
                </div>

                <div className="topbar-status">
                    <span className="status-pill live">LIVE</span>
                    <span className="status-pill">CYCLE OPEN</span>
                </div>
            </div>

            <div className="dashboard-content">
                {/* HEADER */}
                <div className="dashboard-heading">
                    <div>
                        <span className="eyebrow">CONTROL CENTER</span>
                        <h1>Dashboard</h1>
                    </div>

                    <button className="export-btn">
                        EXPORT
                    </button>
                </div>

                {/* KPI ROW */}
                <section className="kpi-grid">
                    <KpiCard
                        label="CUSTOMERS"
                        value={summary.total_customers}
                        detail="REGISTERED"
                    />

                    <KpiCard
                        label="PROPERTIES"
                        value={summary.total_properties}
                        detail="REGISTERED"
                    />

                    <KpiCard
                        label="METERS"
                        value={summary.total_meters}
                        detail={`${summary.total_bills} TOTAL BILLS`}
                    />

                    <KpiCard
                        label="REVENUE"
                        value={`₹${formatMoney(summary.total_revenue)}`}
                        detail="PAYMENT TOTAL"
                    />
                </section>

                {/* MAIN GRID */}
                <section className="main-grid">
                    {/* CONSUMPTION */}
                    <Panel
                        title="Consumption · kWh per month"
                        meta="2025"
                    >
                        <ResponsiveContainer width="100%" height={270}>
                            <AreaChart data={consumptionData}>
                                <defs>
                                    <linearGradient
                                        id="consumptionGradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor="#5FD0BE"
                                            stopOpacity={0.28}
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor="#5FD0BE"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid
                                    stroke="rgba(178,208,212,.06)"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="month"
                                    stroke="#59686B"
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={10}
                                />

                                <YAxis
                                    stroke="#59686B"
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={10}
                                />

                                <Tooltip
                                    contentStyle={{
                                        background: "#0d1214",
                                        border:
                                            "1px solid rgba(178,208,212,.15)",
                                        color: "#eaf1f1",
                                    }}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="consumption"
                                    stroke="#5FD0BE"
                                    fill="url(#consumptionGradient)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Panel>

                    {/* RIGHT SIDE */}
                    <div className="right-stack">
                        {/* BILL STATUS */}
                        <Panel title="Billing status">
                            <div className="status-bar">
                                {billStatus.map((item) => (
                                    <div
                                        key={item.bill_status}
                                        className={`status-segment ${item.bill_status
                                            .toLowerCase()
                                            .replaceAll(" ", "-")}`}
                                        style={{
                                            flex:
                                                item.count /
                                                    billTotal || 1,
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="legend-list">
                                {billStatus.map((item) => (
                                    <div key={item.bill_status}>
                                        <span>
                                            {item.bill_status}
                                        </span>

                                        <b>
                                            {item.count}
                                        </b>
                                    </div>
                                ))}
                            </div>
                        </Panel>

                        {/* PAYMENT METHODS */}
                        <Panel
                            title="Payment distribution"
                            meta="MODE"
                        >
                            <div className="distribution">
                                {paymentMethods.map((item) => (
                                    <div
                                        className="distribution-row"
                                        key={item.payment_mode}
                                    >
                                        <span>
                                            {item.payment_mode}
                                        </span>

                                        <div className="distribution-track">
                                            <i
                                                style={{
                                                    width: `${paymentPercentage(
                                                        item.count
                                                    )}%`,
                                                }}
                                            />
                                        </div>

                                        <b>
                                            {paymentPercentage(
                                                item.count
                                            )}
                                            %
                                        </b>
                                    </div>
                                ))}
                            </div>
                        </Panel>
                    </div>

                    {/* RECENT RECORDS */}
                    <Panel
                        title="Recent records"
                        meta="LAST 6"
                    >
                        <div className="records-table">
                            {recentRecords.map((record) => (
                                <div
                                    className="record-row"
                                    key={record[0]}
                                >
                                    <span>{record[0]}</span>

                                    <strong>
                                        {record[1]}
                                    </strong>

                                    <span>{record[2]}</span>

                                    <b
                                        className={`record-tag ${record[3].toLowerCase()}`}
                                    >
                                        {record[3]}
                                    </b>
                                </div>
                            ))}
                        </div>
                    </Panel>

                    {/* REVENUE */}
                    <Panel
                        title="Revenue · billing cycles"
                        meta="₹ LAKH"
                    >
                        <ResponsiveContainer width="100%" height={270}>
                            <BarChart data={revenueData}>
                                <CartesianGrid
                                    stroke="rgba(178,208,212,.06)"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="month"
                                    stroke="#59686B"
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={10}
                                />

                                <YAxis
                                    stroke="#59686B"
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={10}
                                />

                                <Tooltip
                                    contentStyle={{
                                        background: "#0d1214",
                                        border:
                                            "1px solid rgba(178,208,212,.15)",
                                        color: "#eaf1f1",
                                    }}
                                />

                                <Bar
                                    dataKey="revenue"
                                    fill="#377B72"
                                    radius={[3, 3, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Panel>
                </section>
            </div>
        </div>
    );
}

function KpiCard({ label, value, detail }) {
    return (
        <div className="kpi-card">
            <span>{label}</span>

            <strong>{value}</strong>

            <small>{detail}</small>
        </div>
    );
}

function Panel({ title, meta, children }) {
    return (
        <section className="dashboard-panel">
            <div className="panel-heading">
                <h2>{title}</h2>

                {meta && <span>{meta}</span>}
            </div>

            {children}
        </section>
    );
}

function formatMoney(value) {
    return Number(value || 0).toLocaleString("en-IN");
}

export default Dashboard;