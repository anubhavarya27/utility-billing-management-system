import { useState } from "react";
import { Plus, Clock3, CheckCircle2, XCircle, Eye } from "lucide-react";

import "../styles/records.css";

const initialRequests = [
    {
        id: "REQ-001",
        type: "Customer",
        title: "New customer registration",
        submittedBy: "User 01",
        date: "2025-03-28",
        status: "Pending",
    },
    {
        id: "REQ-002",
        type: "Property",
        title: "Add property",
        submittedBy: "User 02",
        date: "2025-03-27",
        status: "Approved",
    },
    {
        id: "REQ-003",
        type: "Meter",
        title: "New meter installation",
        submittedBy: "User 03",
        date: "2025-03-26",
        status: "Pending",
    },
];

function RecordManagement() {
    const [requests, setRequests] = useState(initialRequests);
    const [showForm, setShowForm] = useState(false);

    const pending = requests.filter(
        (request) => request.status === "Pending"
    ).length;

    const approved = requests.filter(
        (request) => request.status === "Approved"
    ).length;

    const rejected = requests.filter(
        (request) => request.status === "Rejected"
    ).length;

    function addRequest(request) {
        setRequests((current) => [request, ...current]);
        setShowForm(false);
    }

    return (
        <div className="records-page">
            <div className="records-header">
                <div>
                    <span className="eyebrow">OPERATIONS</span>
                    <h1>Processing</h1>
                    <p>
                        Track database change requests currently under
                        processing and review.
                    </p>
                </div>

                <button
                    className="new-request-btn"
                    onClick={() => setShowForm(true)}
                >
                    <Plus size={16} />
                    NEW REQUEST
                </button>
            </div>

            <div className="request-summary">
                <SummaryCard
                    icon={<Clock3 size={17} />}
                    label="PENDING"
                    value={pending}
                />

                <SummaryCard
                    icon={<CheckCircle2 size={17} />}
                    label="APPROVED"
                    value={approved}
                />

                <SummaryCard
                    icon={<XCircle size={17} />}
                    label="REJECTED"
                    value={rejected}
                />
            </div>

            <section className="requests-panel">
                <div className="records-panel-heading">
                    <div>
                        <span>PROCESSING QUEUE</span>
                        <h2>Recent requests</h2>
                    </div>

                    <span>{requests.length} records</span>
                </div>

                <div className="requests-table">
                    <div className="request-row request-head">
                        <span>REQUEST</span>
                        <span>TYPE</span>
                        <span>SUBMITTED BY</span>
                        <span>DATE</span>
                        <span>STATUS</span>
                        <span>ACTION</span>
                    </div>

                    {requests.map((request) => (
                        <div className="request-row" key={request.id}>
                            <div>
                                <strong>{request.id}</strong>
                                <small>{request.title}</small>
                            </div>

                            <span>{request.type}</span>
                            <span>{request.submittedBy}</span>
                            <span>{request.date}</span>

                            <StatusBadge status={request.status} />

                            <div className="request-actions">
                                <button
                                    type="button"
                                    title="View request"
                                >
                                    <Eye size={15} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {showForm && (
                <RequestModal
                    onClose={() => setShowForm(false)}
                    onSubmit={addRequest}
                />
            )}
        </div>
    );
}

function SummaryCard({ icon, label, value }) {
    return (
        <div className="request-summary-card">
            <div className="summary-icon">{icon}</div>
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    );
}

function StatusBadge({ status }) {
    return (
        <span className={`request-status ${status.toLowerCase()}`}>
            {status}
        </span>
    );
}

function RequestModal({ onClose, onSubmit }) {
    const [recordType, setRecordType] = useState("Customer");
    const [description, setDescription] = useState("");
    const [reason, setReason] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        if (!description.trim() || !reason.trim()) {
            return;
        }

        const newRequest = {
            id: `REQ-${String(Date.now()).slice(-3)}`,
            type: recordType,
            title: description,
            submittedBy: "Current User",
            date: new Date().toISOString().split("T")[0],
            status: "Pending",
        };

        onSubmit(newRequest);
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <form
                className="request-modal"
                onClick={(event) => event.stopPropagation()}
                onSubmit={handleSubmit}
            >
                <div className="modal-heading">
                    <div>
                        <span>NEW DATABASE REQUEST</span>
                        <h2>Create record request</h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <label>
                    Record type
                    <select
                        value={recordType}
                        onChange={(event) =>
                            setRecordType(event.target.value)
                        }
                    >
                        <option>Customer</option>
                        <option>Property</option>
                        <option>Meter</option>
                        <option>Meter Reading</option>
                        <option>Tariff</option>
                        <option>Bill</option>
                        <option>Payment</option>
                    </select>
                </label>

                <label>
                    Description
                    <input
                        value={description}
                        onChange={(event) =>
                            setDescription(event.target.value)
                        }
                        placeholder="Describe the requested change"
                    />
                </label>

                <label>
                    Reason
                    <textarea
                        value={reason}
                        onChange={(event) =>
                            setReason(event.target.value)
                        }
                        placeholder="Why is this record required?"
                    />
                </label>

                <div className="modal-actions">
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="submit-request-btn"
                    >
                        Submit for Review
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RecordManagement;