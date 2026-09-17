import { useState } from "react";
import {
    CheckCircle2,
    XCircle,
    Eye,
    Clock3,
    FilePlus2,
    Pencil,
    Trash2,
} from "lucide-react";

import "../styles/records.css";

const initialRequests = [
    {
        id: "REQ-001",
        type: "Customer",
        action: "CREATE",
        title: "New customer registration",
        submittedBy: "User 01",
        date: "2025-03-28",
        status: "Pending",
    },
    {
        id: "REQ-003",
        type: "Meter",
        action: "CREATE",
        title: "New meter installation",
        submittedBy: "User 03",
        date: "2025-03-26",
        status: "Pending",
    },
    {
        id: "REQ-004",
        type: "Bill",
        action: "UPDATE",
        title: "Update billing record",
        submittedBy: "User 02",
        date: "2025-03-25",
        status: "Pending",
    },
    {
        id: "REQ-005",
        type: "Property",
        action: "DELETE",
        title: "Remove inactive property",
        submittedBy: "User 04",
        date: "2025-03-24",
        status: "Pending",
    },
];

function AdminPanel() {
    const [requests, setRequests] = useState(initialRequests);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const pendingRequests = requests.filter(
        (request) => request.status === "Pending"
    );

    const approvedRequests = requests.filter(
        (request) => request.status === "Approved"
    );

    const rejectedRequests = requests.filter(
        (request) => request.status === "Rejected"
    );

    function updateStatus(id, status) {
        setRequests((current) =>
            current.map((request) =>
                request.id === id
                    ? { ...request, status }
                    : request
            )
        );

        setSelectedRequest(null);
    }

    return (
        <div className="records-page">
            <div className="records-header">
                <div>
                    <span className="eyebrow">ADMINISTRATION</span>
                    <h1>Approvals</h1>
                    <p>
                        Review and process database change requests
                        submitted by users.
                    </p>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "12px",
                        color: "#9aa5a6",
                    }}
                >
                    <Clock3 size={15} />
                    {pendingRequests.length} pending
                </div>
            </div>

            <div className="request-summary">
                <SummaryCard
                    icon={<Clock3 size={17} />}
                    label="PENDING"
                    value={pendingRequests.length}
                />

                <SummaryCard
                    icon={<CheckCircle2 size={17} />}
                    label="APPROVED"
                    value={approvedRequests.length}
                />

                <SummaryCard
                    icon={<XCircle size={17} />}
                    label="REJECTED"
                    value={rejectedRequests.length}
                />
            </div>

            <section className="requests-panel">
                <div className="records-panel-heading">
                    <div>
                        <span>ADMIN REVIEW QUEUE</span>
                        <h2>Requests awaiting approval</h2>
                    </div>

                    <span>
                        {pendingRequests.length} pending
                    </span>
                </div>

                <div className="requests-table">
                    <div className="request-row request-head">
                        <span>REQUEST</span>
                        <span>TYPE</span>
                        <span>ACTION</span>
                        <span>SUBMITTED BY</span>
                        <span>DATE</span>
                        <span>STATUS</span>
                        <span />
                    </div>

                    {requests.map((request) => (
                        <div
                            className="request-row"
                            key={request.id}
                        >
                            <div>
                                <strong>{request.id}</strong>
                                <small>{request.title}</small>
                            </div>

                            <span>{request.type}</span>

                            <ActionBadge action={request.action} />

                            <span>{request.submittedBy}</span>

                            <span>{request.date}</span>

                            <StatusBadge
                                status={request.status}
                            />

                            <div className="request-actions">
                                <button
                                    type="button"
                                    title="View request"
                                    onClick={() =>
                                        setSelectedRequest(
                                            request
                                        )
                                    }
                                >
                                    <Eye size={15} />
                                </button>

                                {request.status === "Pending" && (
                                    <>
                                        <button
                                            type="button"
                                            title="Approve"
                                            className="approve"
                                            onClick={() =>
                                                updateStatus(
                                                    request.id,
                                                    "Approved"
                                                )
                                            }
                                        >
                                            <CheckCircle2
                                                size={15}
                                            />
                                        </button>

                                        <button
                                            type="button"
                                            title="Reject"
                                            className="reject"
                                            onClick={() =>
                                                updateStatus(
                                                    request.id,
                                                    "Rejected"
                                                )
                                            }
                                        >
                                            <XCircle size={15} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}

                    {requests.length === 0 && (
                        <div className="empty-state">
                            No requests available.
                        </div>
                    )}
                </div>
            </section>

            {selectedRequest && (
                <RequestDetails
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    onApprove={() =>
                        updateStatus(
                            selectedRequest.id,
                            "Approved"
                        )
                    }
                    onReject={() =>
                        updateStatus(
                            selectedRequest.id,
                            "Rejected"
                        )
                    }
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
        <span
            className={`request-status ${status.toLowerCase()}`}
        >
            {status}
        </span>
    );
}

function ActionBadge({ action }) {
    const icons = {
        CREATE: <FilePlus2 size={12} />,
        UPDATE: <Pencil size={12} />,
        DELETE: <Trash2 size={12} />,
    };

    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.04em",
            }}
        >
            {icons[action]}
            {action}
        </span>
    );
}

function RequestDetails({
    request,
    onClose,
    onApprove,
    onReject,
}) {
    return (
        <div
            className="modal-backdrop"
            onClick={onClose}
        >
            <div
                className="request-modal"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >
                <div className="modal-heading">
                    <div>
                        <span>REQUEST DETAILS</span>
                        <h2>{request.id}</h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div
                    style={{
                        display: "grid",
                        gap: "18px",
                        marginBottom: "24px",
                    }}
                >
                    <DetailRow
                        label="Request"
                        value={request.title}
                    />

                    <DetailRow
                        label="Record type"
                        value={request.type}
                    />

                    <DetailRow
                        label="Action"
                        value={request.action}
                    />

                    <DetailRow
                        label="Submitted by"
                        value={request.submittedBy}
                    />

                    <DetailRow
                        label="Submitted on"
                        value={request.date}
                    />

                    <DetailRow
                        label="Status"
                        value={request.status}
                    />
                </div>

                {request.status === "Pending" && (
                    <div className="modal-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                        >
                            Close
                        </button>

                        <button
                            type="button"
                            className="submit-request-btn"
                            onClick={onApprove}
                        >
                            <CheckCircle2 size={15} />
                            Approve
                        </button>

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onReject}
                        >
                            <XCircle size={15} />
                            Reject
                        </button>
                    </div>
                )}

                {request.status !== "Pending" && (
                    <div className="modal-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function DetailRow({ label, value }) {
    return (
        <div>
            <span
                style={{
                    display: "block",
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    color: "#7d8889",
                    marginBottom: "5px",
                }}
            >
                {label.toUpperCase()}
            </span>

            <strong
                style={{
                    color: "#eaf1f1",
                    fontSize: "14px",
                }}
            >
                {value}
            </strong>
        </div>
    );
}

export default AdminPanel;