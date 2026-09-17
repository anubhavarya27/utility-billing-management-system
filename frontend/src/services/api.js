const API_BASE_URL = "http://localhost:5000/api";

async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });

    const result = await response.json();

    if (!response.ok || result.success === false) {
        throw new Error(result.message || `Request failed: ${response.status}`);
    }

    return result.data;
}

// Dashboard
export const getDashboardSummary = () =>
    apiRequest("/dashboard/summary");

export const getBillStatus = () =>
    apiRequest("/dashboard/bill-status");

export const getPaymentMethods = () =>
    apiRequest("/dashboard/payment-methods");

export const getConsumption = () =>
    apiRequest("/dashboard/consumption");

export const getRevenue = () =>
    apiRequest("/dashboard/revenue");

export const getTopMeters = () =>
    apiRequest("/dashboard/top-meters");

export const getCustomerSummary = () =>
    apiRequest("/dashboard/customer-summary");

export const getServiceDistribution = () =>
    apiRequest("/dashboard/service-distribution");

export const getMeterStatus = () =>
    apiRequest("/dashboard/meter-status");

// Core entities
export const getCustomers = () =>
    apiRequest("/customers");

export const getCustomer = (id) =>
    apiRequest(`/customers/${id}`);

export const getProperties = () =>
    apiRequest("/properties");

export const getMeters = () =>
    apiRequest("/meters");

export const getReadings = () =>
    apiRequest("/readings");

export const getBills = () =>
    apiRequest("/bills");

export const getPayments = () =>
    apiRequest("/payments");

export const getServices = () =>
    apiRequest("/services");

export const getTariffs = () =>
    apiRequest("/tariffs");

export const getOwnerships = () =>
    apiRequest("/ownerships");

export const getPropertyMeters = () =>
    apiRequest("/property-meters");

export const getMeterServices = () =>
    apiRequest("/meter-services");
// Customer contact tables
export const getCustomerPhones = () =>
    apiRequest("/customer-phones");

export const getCustomerEmails = () =>
    apiRequest("/customer-emails");

// Payment schedule
export const getPaymentSchedules = () =>
    apiRequest("/payment-schedules");

// Card
export const getCards = () =>
    apiRequest("/card-payments/cards");

// Card payments
export const getCardPayments = () =>
    apiRequest("/card-payments");

// Cash payments
export const getCashPayments = () =>
    apiRequest("/cash-payments");

// UPI payments
export const getUpiPayments = () =>
    apiRequest("/upi-payments");
export const getElectricityServices = () =>
    apiRequest("/electricity-services");

export const getWaterServices = () =>
    apiRequest("/water-services");
// Reports
export const getReportOverview = () =>
    apiRequest("/reports/overview");

export const getMonthlyReport = () =>
    apiRequest("/reports/monthly");

export const getReportBillStatus = () =>
    apiRequest("/reports/bill-status");

export const getReportPaymentMethods = () =>
    apiRequest("/reports/payment-methods");

export const getTopConsumingMeters = () =>
    apiRequest("/reports/top-meters");