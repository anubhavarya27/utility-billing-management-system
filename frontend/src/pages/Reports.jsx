import {
    BarChart3,
    TrendingUp,
    Receipt,
    CreditCard,
    Users,
    Gauge,
} from "lucide-react";

import "../styles/dashboard.css";

function Reports() {
    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <span className="eyebrow">ANALYTICS</span>
                    <h1>Reports</h1>
                    <p>
                        Utility billing and system performance
                        reports.
                    </p>
                </div>
            </div>

            <div className="dashboard-grid">
                <ReportCard
                    icon={<Users size={20} />}
                    title="Customer Report"
                    value="10"
                    description="Registered customers"
                />

                <ReportCard
                    icon={<Receipt size={20} />}
                    title="Billing Report"
                    value="30"
                    description="Bills generated"
                />

                <ReportCard
                    icon={<CreditCard size={20} />}
                    title="Payment Report"
                    value="19"
                    description="Payments recorded"
                />

                <ReportCard
                    icon={<Gauge size={20} />}
                    title="Meter Report"
                    value="10"
                    description="Registered meters"
                />

                <ReportCard
                    icon={<TrendingUp size={20} />}
                    title="Revenue"
                    value="₹18,505"
                    description="Recorded revenue"
                />

                <ReportCard
                    icon={<BarChart3 size={20} />}
                    title="Consumption"
                    value="Monthly"
                    description="Utility consumption analysis"
                />
            </div>
        </div>
    );
}

function ReportCard({ icon, title, value, description }) {
    return (
        <div className="stat-card">
            <div className="stat-card-icon">
                {icon}
            </div>

            <div className="stat-card-content">
                <span>{title}</span>
                <strong>{value}</strong>
                <small>{description}</small>
            </div>
        </div>
    );
}

export default Reports;