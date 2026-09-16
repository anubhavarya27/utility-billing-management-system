# Utility Billing Management System

## API Contract

**Base URL:**

`http://localhost:5000/api`

---

# 1. Customers

## GET /customers

Returns all customers.

### Response

```json
{
  "success": true,
  "data": [
    {
      "cust_id": 1,
      "cust_name": "John Doe",
      "apartment": "Sunrise Apartments",
      "flat_no": "A-101",
      "city": "Chennai",
      "dob": "1995-05-10"
    }
  ]
}
```

## GET /customers/:id

Returns one customer by customer ID.

### Example

`GET /customers/1`

### Response

```json
{
  "success": true,
  "data": {
    "cust_id": 1,
    "cust_name": "John Doe",
    "apartment": "Sunrise Apartments",
    "flat_no": "A-101",
    "city": "Chennai",
    "dob": "1995-05-10"
  }
}
```

## POST /customers

Creates a new customer.

### Request Body

```json
{
  "cust_id": 1,
  "cust_name": "John Doe",
  "apartment": "Sunrise Apartments",
  "flat_no": "A-101",
  "city": "Chennai",
  "dob": "1995-05-10"
}
```

## PUT /customers/:id

Updates an existing customer.

### Request Body

```json
{
  "cust_name": "John Doe",
  "apartment": "Sunrise Apartments",
  "flat_no": "A-102",
  "city": "Chennai",
  "dob": "1995-05-10"
}
```

## DELETE /customers/:id

Deletes a customer by customer ID.

---

# 2. Properties

## GET /properties

Returns all properties.

### Response

```json
{
  "success": true,
  "data": [
    {
      "property_id": 1,
      "property_name": "Sunrise Apartments",
      "occupancy_status": "Occupied"
    }
  ]
}
```

## GET /properties/:id

Returns one property by property ID.

### Example

`GET /properties/1`

---

# 3. Meters

## GET /meters

Returns all meters.

### Response

```json
{
  "success": true,
  "data": [
    {
      "meter_id": 101,
      "capacity": 10,
      "installation_date": "2025-01-15",
      "meter_status": "Active"
    }
  ]
}
```

## GET /meters/:id

Returns one meter by meter ID.

### Example

`GET /meters/101`

---

# 4. Utility Services

## GET /services

Returns all utility services.

### Response

```json
{
  "success": true,
  "data": [
    {
      "service_id": 1,
      "fixed_charge": 100,
      "unit_rate": 7,
      "tax": 5
    }
  ]
}
```

## GET /services/:id

Returns one utility service by service ID.

### Example

`GET /services/1`

---

# 5. Bills

## GET /bills

Returns all bills.

### Response

```json
{
  "success": true,
  "data": [
    {
      "meter_id": 101,
      "billing_month": "2026-09",
      "bill_id": 1001,
      "billing_date": "2026-09-01",
      "previous_reading": 1000,
      "current_reading": 1150,
      "tariff_code": "E-R1",
      "bill_status": "Pending"
    }
  ]
}
```

## GET /bills/:id

Returns one bill using `bill_id`.

### Example

`GET /bills/1001`

---

# 6. Payments

## GET /payments

Returns all payments.

### Response

```json
{
  "success": true,
  "data": [
    {
      "bill_id": 1001,
      "payment_sequence": 1,
      "payment_id": 5001,
      "payment_date": "2026-09-10",
      "amount": 1200,
      "payment_mode": "UPI",
      "payment_due_date": "2026-09-15"
    }
  ]
}
```

## GET /payments/:id

Returns one payment using `payment_id`.

### Example

`GET /payments/5001`

---

# 7. Dashboard

## GET /dashboard/summary

Returns overall dashboard statistics.

### Response

```json
{
  "success": true,
  "data": {
    "total_customers": 100,
    "total_properties": 80,
    "total_meters": 75,
    "total_bills": 150,
    "total_revenue": 250000
  }
}
```

## GET /dashboard/bill-status

Returns bills grouped by bill status.

### Response

```json
{
  "success": true,
  "data": [
    {
      "bill_status": "Paid",
      "count": 100
    },
    {
      "bill_status": "Pending",
      "count": 50
    }
  ]
}
```

## GET /dashboard/payment-methods

Returns payment statistics grouped by payment mode.

### Response

```json
{
  "success": true,
  "data": [
    {
      "payment_mode": "UPI",
      "count": 60,
      "total_amount": 100000
    },
    {
      "payment_mode": "CARD",
      "count": 30,
      "total_amount": 80000
    },
    {
      "payment_mode": "CASH",
      "count": 10,
      "total_amount": 30000
    }
  ]
}
```

---

# 8. Error Responses

## Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Resource Not Found

Example:

```json
{
  "success": false,
  "message": "Customer not found"
}
```

## Invalid Request

Example:

```json
{
  "success": false,
  "message": "cust_id and cust_name are required"
}
```

---

# 9. Backend and Frontend Rules

- The frontend communicates with the backend using HTTP and JSON.
- The frontend must not connect directly to MySQL.
- The backend communicates with MySQL using `mysql2`.
- Database credentials are stored in `.env`.
- `.env` must not be committed to Git.
- `.env.example` can be committed to Git.
- API field names should not be changed without coordinating with the frontend and database team.
- The example values in this document are sample values only and do not represent actual database records.

---

# 10. Current API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/customers` | Get all customers |
| GET | `/customers/:id` | Get customer by ID |
| POST | `/customers` | Create customer |
| PUT | `/customers/:id` | Update customer |
| DELETE | `/customers/:id` | Delete customer |
| GET | `/properties` | Get all properties |
| GET | `/properties/:id` | Get property by ID |
| GET | `/meters` | Get all meters |
| GET | `/meters/:id` | Get meter by ID |
| GET | `/services` | Get all utility services |
| GET | `/services/:id` | Get service by ID |
| GET | `/bills` | Get all bills |
| GET | `/bills/:id` | Get bill by ID |
| GET | `/payments` | Get all payments |
| GET | `/payments/:id` | Get payment by ID |
| GET | `/dashboard/summary` | Get dashboard summary |
| GET | `/dashboard/bill-status` | Get bill status statistics |
| GET | `/dashboard/payment-methods` | Get payment method statistics |