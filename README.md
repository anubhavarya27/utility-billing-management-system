# ⚡ U/BILL — Utility Billing Management System

<div align="center">

### A Full-Stack DBMS Application for Utility Billing, Metering, Payments & Controlled Database Operations

**React · Node.js · Express · MySQL · REST API · JWT**

</div>

---

## 🌐 GitHub Repository

**[Utility Billing Management System →](https://github.com/anubhavarya27/utility-billing-management-system)**

---

## 📌 Project Overview

**U/BILL (Utility Billing Management System)** is a full-stack, database-driven web application developed as an academic **Database Management Systems (DBMS)** project.

The system models and manages the complete utility billing lifecycle:

```text
Customer
   ↓
Property
   ↓
Meter
   ↓
Meter Reading
   ↓
Utility Service + Tariff
   ↓
Bill
   ↓
Payment Schedule
   ↓
Payment
   ├── Card
   ├── Cash
   └── UPI
```

In addition to the core billing workflow, U/BILL manages:

- Customers and contact information
- Properties and ownership
- Utility meters and readings
- Electricity and water services
- Tariffs
- Bills and billing status
- Payment schedules
- Card, cash and UPI payments
- Dashboard metrics
- Reports and analytics
- Database exploration
- Authentication and authorization
- Controlled SQL operations
- Administrator approval/rejection of write queries

The project demonstrates the complete path from **EER-oriented database design to a working full-stack application**.

```text
EER Model
    ↓
Relational Schema
    ↓
Normalization / BCNF-Oriented Design
    ↓
MySQL Database
    ↓
SQL Queries
    ↓
Node.js + Express REST API
    ↓
React Frontend
    ↓
Integrated Utility Billing System
```

> **Academic focus:** Relational database design, keys and constraints, normalization concepts, specialization, SQL, transactions, REST API integration, authentication, authorization, and controlled database access.

---

# 🎯 Objectives

The project aims to:

1. Design a realistic relational database for utility billing operations.
2. Model entities and relationships using an EER-oriented approach.
3. Implement primary keys, composite keys, foreign keys, unique constraints, and referential integrity.
4. Represent multivalued attributes and relationship entities using separate relations.
5. Demonstrate specialization for utility services and payment methods.
6. Provide REST APIs for application-to-database communication.
7. Build a usable React interface for interacting with the system.
8. Implement JWT-based authentication and role-based authorization.
9. Execute read-only SQL directly through Query Studio.
10. Route database-changing SQL through an administrator approval workflow.
11. Use transactions for approved DML batches.
12. Provide dashboard, reporting, billing, payment, metering, and management functionality.

---

# 🏗️ System Architecture

U/BILL follows a layered three-tier architecture.

```text
┌──────────────────────────────┐
│        User / Browser        │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│        React Frontend        │
│        User Interface        │
└──────────────┬───────────────┘
               │
            HTTP / JSON
               │
               ▼
┌──────────────────────────────┐
│     Node.js + Express API    │
│                              │
│  Routes                      │
│  Controllers                 │
│  Authentication              │
│  Authorization               │
│  Query Classification        │
│  Transaction Handling        │
└──────────────┬───────────────┘
               │
             mysql2
               │
               ▼
┌──────────────────────────────┐
│       MySQL Database         │
│                              │
│  Relational Tables           │
│  Keys & Constraints          │
│  Billing Data                │
│  Payment Data                │
│  Workflow Data               │
└──────────────────────────────┘
```

### Architecture Flow

```text
React Frontend
      │
      │ HTTP / JSON
      ▼
Node.js + Express REST API
      │
      ├── Authentication / JWT
      ├── Role-Based Authorization
      ├── Routes
      ├── Controllers
      ├── Query Classification
      └── Transaction Handling
      │
      ▼
mysql2 Connection Pool
      │
      ▼
MySQL Database
```

### Architectural Principle

The frontend **never connects directly to MySQL**.

All database access follows:

```text
Frontend → REST API → Backend → MySQL
```

This keeps database credentials and database logic on the server side.

---

# 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React | User interface |
| Frontend Routing | React Router | Page and protected-route navigation |
| Styling | CSS | Application styling |
| Icons | Lucide React | Interface icons |
| Client API | Fetch API | HTTP communication |
| Backend Runtime | Node.js | Server-side JavaScript runtime |
| Backend Framework | Express.js | REST API and middleware |
| Database Driver | mysql2 | MySQL connectivity and connection pooling |
| Authentication | JSON Web Token (JWT) | Stateless authentication |
| Password Hashing | bcryptjs | Password protection |
| Configuration | dotenv | Environment-variable configuration |
| Cross-Origin Support | CORS | Frontend/backend communication |
| Database | MySQL | Relational data management |
| Version Control | Git | Source control |
| Repository | GitHub | Collaboration and code hosting |

---

# ✨ Complete Functionality

## 👥 Customer Management

The system manages customer records including:

- Customer ID
- Customer name
- Apartment
- Flat number
- City
- Date of birth

Customer contact details are separated into dedicated relations:

```text
CUSTOMER_PHONE
CUSTOMER_EMAIL
```

This supports multiple phone numbers and email addresses per customer without storing repeating attributes inside the customer table.

---

## 🏢 Property Management

Property records include:

- Property ID
- Property name
- Occupancy status

Customer ownership is represented through:

```text
CUSTOMER_OWNS_PROPERTY
```

The relationship stores:

- Customer
- Property
- Ownership date
- Ownership type

---

## ⚡ Meter Management

Meters store:

- Meter ID
- Capacity
- Installation date
- Meter status

Properties are associated with meters through:

```text
PROPERTY_INCORPORATE_METER
```

Meter readings are stored independently using:

```text
(meter_id, reading_no)
```

as a composite identifier.

---

## 📈 Meter Reading Management

The system maintains historical readings including:

- Meter ID
- Reading number
- Reading date
- Reading value
- Reading status

This historical data supports billing based on previous and current readings.

---

## 💡 Utility Service Management

The generalized service relation stores:

- Service ID
- Fixed charge
- Unit rate
- Tax

The design uses specialization:

```text
             UTILITY_SERVICE
                   │
          ┌────────┴────────┐
          ▼                 ▼
 ELECTRICITY_SERVICE   WATER_SERVICE
```

Electricity services additionally contain:

- Voltage level

Water services additionally contain:

- Water source

---

## 💰 Tariff Management

Tariffs are maintained using:

- Tariff code
- Unit rate

Bills reference the applicable tariff through a foreign key.

This separates tariff information from individual bill records and allows rates to be managed independently.

---

## 🧾 Billing Management

The billing module stores:

- Meter ID
- Billing month
- Bill ID
- Billing date
- Previous reading
- Current reading
- Tariff code
- Bill status

The identifying composite key is:

```text
(meter_id, billing_month)
```

The bill amount is derived from billing information and applicable charges rather than being treated as an independent base attribute in the conceptual design.

---

## 💳 Payment Management

Payments contain:

- Bill ID
- Payment sequence
- Payment date
- Amount
- Payment mode
- Payment due date

Payment methods are modeled using specialization:

```text
               PAYMENT
                  │
       ┌──────────┼──────────┐
       ▼          ▼          ▼
CARD_PAYMENT  CASH_PAYMENT  UPI_PAYMENT
```

### Card Payment

Card payments are associated with card information through:

```text
CARD
CARD_PAYMENT
```

### Cash Payment

Cash payments are stored through:

```text
CASH_PAYMENT
```

with receipt information.

### UPI Payment

UPI payments store:

- UPI ID
- UPI application

through:

```text
UPI_PAYMENT
```

---

# 📊 Dashboard & Reports

## Dashboard

The Dashboard acts as the main operational control center and presents database-backed information such as:

- Total customers
- Total properties
- Total meters
- Revenue
- Consumption analysis
- Bill-status distribution
- Payment-method distribution
- Recent billing and payment activity
- Monthly revenue information

Dashboard values are retrieved through backend APIs connected to MySQL rather than hard-coded frontend values.

## Reports & Analytics

The Reports module provides SQL-backed analytical views covering:

- Customer count
- Property count
- Meter count
- Bill count
- Payment count
- Revenue
- Consumption
- Monthly consumption
- Monthly revenue
- Bill-status distribution
- Payment-method distribution
- Top-consuming meters

These reports convert normalized relational data into operational summaries useful for billing, consumption, payment, and revenue analysis.

Reporting operations are maintained separately from the core entity controllers to keep the backend modular.

---

# 🔐 Authentication & Authorization

U/BILL implements application authentication using:

- JWT authentication tokens
- bcrypt password hashing
- Role-based authorization
- Protected backend routes

## Supported Roles

| Role | Purpose |
|---|---|
| `USER` | Normal authenticated application access |
| `ADMIN` | Administrative operations and Query Studio approvals |

### Authentication Flow

```text
Login Form
   ↓
POST /api/auth/login
   ↓
Backend Credential Verification
   ↓
JWT Token
   ↓
Authenticated Session
   ↓
Protected API Requests
```

Users select their role and submit their username and password to the backend. After successful authentication, the frontend stores the authenticated session and uses the returned token for protected API requests.

### Password Protection

Passwords are hashed using `bcryptjs`.

Plain-text passwords are never returned by the authentication API.

### Administrator Account

The predefined administrator identity is configured through backend environment variables and is not created through normal public registration.

---

# 🗂️ Database Explorer

The Database Explorer provides an interactive interface for inspecting the project database through backend APIs.

### Capabilities

- View project relations
- Select individual tables
- Retrieve records
- Search and filter records
- Inspect table columns
- View record counts
- Inspect relational data without connecting the browser directly to MySQL

The 20 core domain relations are:

```text
CUSTOMER
CUSTOMER_PHONE
CUSTOMER_EMAIL
PROPERTY
CUSTOMER_OWNS_PROPERTY
METER
PROPERTY_INCORPORATE_METER
METER_READING
UTILITY_SERVICE
ELECTRICITY_SERVICE
WATER_SERVICE
METER_SERVICE
TARIFF
BILL
PAYMENT_SCHEDULE
PAYMENT
CARD
CARD_PAYMENT
CASH_PAYMENT
UPI_PAYMENT
```

---

# 🧪 Query Studio & Controlled SQL Execution

Query Studio is one of the major technical and academic features of U/BILL.

It allows authenticated users to submit SQL queries while ensuring that database-changing operations are subject to administrator approval.

## Read-Only SQL

The backend recognizes read-oriented SQL such as:

```text
SELECT
SHOW
DESCRIBE
DESC
EXPLAIN
WITH ... SELECT
```

Example:

```sql
SELECT *
FROM CUSTOMER
LIMIT 10;
```

Read-only queries can be executed immediately after authentication.

Supported constructs include:

- `WHERE`
- `JOIN`
- `GROUP BY`
- `HAVING`
- `ORDER BY`
- Aggregate functions
- Subqueries
- CTE-based reads

Results are returned to the frontend and displayed as query output.

---

## Write SQL

Database-changing operations include:

```text
INSERT
UPDATE
DELETE
REPLACE
MERGE
CREATE
ALTER
DROP
TRUNCATE
RENAME
GRANT
REVOKE
CALL
LOAD
IMPORT
```

A normal authenticated user does not execute these operations immediately.

Instead:

```text
User submits query
      ↓
Server-side SQL classification
      ↓
WRITE
      ↓
QUERY_REQUEST
      ↓
PENDING
      ↓
Administrator Review
```

---

# 🧠 Server-Side SQL Classification

SQL classification is performed **by the backend**, not by the frontend.

Before classification, the backend handles cases such as:

- Leading whitespace
- SQL comments
- Multiple statements
- Semicolon-separated statements
- `WITH ... SELECT` queries
- Multiple-statement batches
- Mixed read/write queries

The server examines the complete submitted SQL rather than trusting a frontend-provided query type.

### Mixed Read + Write Query

For example:

```sql
SELECT *
FROM CUSTOMER
LIMIT 1;

UPDATE CUSTOMER
SET cust_name = 'Example'
WHERE cust_id = 1;
```

The complete batch is classified as:

```text
WRITE
```

The `SELECT` statement is **not executed before approval**.

This prevents a user from hiding a database-changing operation inside a larger read-oriented request.

---

# ✅ Query Approval Workflow

The `QUERY_REQUEST` table stores the lifecycle of database-changing SQL.

```text
              ┌─────────────┐
              │   PENDING   │
              └──────┬──────┘
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
      APPROVED                REJECTED
          │
          ▼
      EXECUTING
          │
      ┌───┴────┐
      ▼        ▼
 COMPLETED   FAILED
```

Each query request records:

- Request ID
- Submitted user
- Reviewing administrator
- SQL query
- Query type
- Status
- Submission timestamp
- Review timestamp
- Rejection reason
- Execution result

### Approval

```text
PENDING
   ↓
APPROVED
   ↓
EXECUTING
   ↓
COMPLETED / FAILED
```

The authenticated administrator ID is stored as `reviewed_by`.

### Rejection

```text
PENDING
   ↓
REJECTED
```

The system stores:

- Reviewing administrator
- Review timestamp
- Rejection reason

Rejected SQL is not executed.

---

# 🔄 Transaction Handling

Approved DML batches use database transactions.

For DML such as:

```text
INSERT
UPDATE
DELETE
REPLACE
MERGE
```

the backend follows:

```text
BEGIN
  │
  ├── Execute Statement 1
  ├── Execute Statement 2
  ├── ...
  │
  ├── All Successful
  │        │
  │        ▼
  │      COMMIT
  │
  └── Any Failure
           │
           ▼
        ROLLBACK
```

This prevents partially completed DML batches.

### DDL Handling

Statements such as:

```text
CREATE
ALTER
DROP
TRUNCATE
RENAME
```

are handled separately because DDL may have database-specific implicit commit behavior.

The system does not incorrectly claim that arbitrary DDL operations can always be rolled back in the same manner as DML.

---

# ⏳ Processing Queue

The Processing Queue tracks SQL requests submitted through Query Studio.

### Request Statuses

```text
PENDING
   ↓
APPROVED
   ↓
EXECUTING
   ↓
COMPLETED
```

or:

```text
PENDING
   ↓
REJECTED
```

A failed approved execution is recorded as:

```text
EXECUTING
   ↓
FAILED
```

### Processing Features

- View pending requests
- View approved/executing requests
- View completed requests
- View rejected requests
- Inspect submitted SQL
- View submitter information
- View administrator review information
- View rejection reasons
- View execution results
- Refresh the queue
- Periodically refresh request information

The Processing Queue is intended for lifecycle monitoring, while approval decisions are handled through the administrator interface.

---

# 🛡️ Admin Approvals

The Admin Approvals area provides controlled review of write-query requests.

### Administrator Operations

An administrator can:

- View pending SQL requests
- Inspect the complete SQL submission
- View request metadata
- Approve a request
- Reject a request
- Provide a rejection reason
- Review execution results
- Track completed and rejected requests

### Approval Flow

```text
User submits INSERT / UPDATE / DELETE / DDL
                    ↓
               QUERY_REQUEST
                    ↓
                  PENDING
                    ↓
              Admin Review
                /       \
           APPROVE     REJECT
              ↓           ↓
          EXECUTING    REJECTED
              ↓
          COMPLETED
```

Write queries submitted through Query Studio never execute directly from the initial user submission path. They first become approval requests.

---

# ⚙️ Operations Hub

The Operations Hub provides focused views over the utility-billing domain.

## Customer 360

Provides a consolidated customer view containing:

- Customer details
- Properties
- Associated meters
- Billing information
- Payment information

## Property Portfolio

Provides a property-oriented view containing:

- Properties
- Occupancy information
- Customer ownership relationships
- Associated meters

## Meter Monitor

Provides meter-focused information including:

- Meter details
- Capacity
- Installation information
- Meter status
- Meter readings
- Consumption-related information

## Tariff Lab

Provides tariff and service-oriented information including:

- Tariff codes
- Unit rates
- Utility service information
- Electricity services
- Water services
- Billing/tariff context

## Billing Center

Provides billing-focused information including:

- Bills
- Billing periods
- Meter readings used for billing
- Tariffs
- Bill status
- Payment schedules
- Billing and revenue context

## Payment Hub

Provides payment-focused information including:

- Payment records
- Payment amount
- Payment date
- Payment mode
- Card payment details
- Cash payment details
- UPI payment details

---

# 🗃️ Data Management

The application provides backend-connected data retrieval and management for the major utility-billing entities.

## Customer

- Retrieve customers
- Create customers
- Update customers
- Delete customers
- Maintain multiple phone numbers
- Maintain multiple email addresses

## Property

- Retrieve property records
- Track occupancy
- Connect customers and properties

## Meter

- Retrieve meters
- Track capacity
- Track installation date
- Track meter status
- Retrieve meter readings
- Add meter readings

## Utility Services

- Retrieve common utility services
- Retrieve electricity services
- Retrieve water services
- Associate services with meters

## Tariffs

- Retrieve tariff records
- Maintain tariff unit rates
- Associate tariffs with bills

## Bills

- Retrieve bills
- Create bills
- Update bills
- Track previous and current readings
- Track tariff
- Track bill status

## Payments

- Retrieve payments
- Create payments
- Associate payments with bills
- Track payment dates and amounts
- Track payment modes

### Payment Specialization

```text
PAYMENT
   ├── CARD_PAYMENT ── CARD
   ├── CASH_PAYMENT
   └── UPI_PAYMENT
```

---

# 🔬 Query Request Data Model

Controlled SQL operations are tracked using the `QUERY_REQUEST` relation.

Important fields include:

```text
request_id
submitted_by
reviewed_by
sql_query
query_type
status
submitted_at
reviewed_at
rejection_reason
execution_result
```

The table uses authenticated application users for both submission and administrator review, allowing the complete lifecycle of a controlled SQL operation to be recorded.

---

# 🧾 Database Integrity & Validation

U/BILL combines application-level validation with database-level constraints.

## Primary Keys

```text
CUSTOMER       → cust_id
PROPERTY       → property_id
METER          → meter_id
UTILITY_SERVICE → service_id
TARIFF         → tariff_code
CARD           → card_no
```

## Composite Keys

```text
CUSTOMER_PHONE
→ (cust_id, phone_no)

CUSTOMER_EMAIL
→ (cust_id, email)

CUSTOMER_OWNS_PROPERTY
→ (cust_id, property_id)

METER_READING
→ (meter_id, reading_no)

METER_SERVICE
→ (meter_id, service_id)

BILL
→ (meter_id, billing_month)

PAYMENT
→ (bill_id, payment_sequence)
```

Composite keys are used where uniqueness depends on multiple attributes.

## Foreign Keys

Examples include:

```text
CUSTOMER_OWNS_PROPERTY → CUSTOMER
CUSTOMER_OWNS_PROPERTY → PROPERTY

PROPERTY_INCORPORATE_METER → PROPERTY
PROPERTY_INCORPORATE_METER → METER

METER_READING → METER

METER_SERVICE → METER
METER_SERVICE → UTILITY_SERVICE

BILL → METER
BILL → TARIFF

PAYMENT → BILL
PAYMENT → PAYMENT_SCHEDULE
```

## Check Constraints

Representative validation rules include:

```text
Meter capacity > 0
Meter reading value >= 0
Bill current reading >= previous reading
Payment amount > 0
Tariff unit rate >= 0
```

These constraints help prevent invalid domain values from entering the database.

---

# 🗃️ Database Design

The core utility-billing schema contains **20 domain tables**.

The application also uses additional tables for authentication and controlled-access workflows.

```text
20 Core Domain Tables
        +
Application / Workflow Tables
```

## Database Tables

### Customer & Property Domain

| Table | Purpose |
|---|---|
| `CUSTOMER` | Customer master information |
| `CUSTOMER_PHONE` | Multiple phone numbers per customer |
| `CUSTOMER_EMAIL` | Multiple email addresses per customer |
| `PROPERTY` | Property information |
| `CUSTOMER_OWNS_PROPERTY` | Customer-property ownership relationship |

### Metering Domain

| Table | Purpose |
|---|---|
| `METER` | Meter details |
| `PROPERTY_INCORPORATE_METER` | Property-meter association |
| `METER_READING` | Historical meter readings |

### Utility Services

| Table | Purpose |
|---|---|
| `UTILITY_SERVICE` | General utility service information |
| `ELECTRICITY_SERVICE` | Electricity specialization |
| `WATER_SERVICE` | Water specialization |
| `METER_SERVICE` | Meter-service relationship |
| `TARIFF` | Tariff codes and rates |

### Billing & Payments

| Table | Purpose |
|---|---|
| `BILL` | Utility billing information |
| `PAYMENT` | Payment records |
| `PAYMENT_SCHEDULE` | Payment schedules and due dates |
| `CARD` | Card information |
| `CARD_PAYMENT` | Card-payment specialization |
| `CASH_PAYMENT` | Cash-payment specialization |
| `UPI_PAYMENT` | UPI-payment specialization |

### Application & Workflow

| Table | Purpose |
|---|---|
| `users` | Application users, password hashes and roles |
| `access_requests` | General controlled-access workflow |
| `QUERY_REQUEST` | Query Studio approval workflow |

> The 20 tables above are the core utility-billing domain relations. Authentication and workflow tables support the application layer.

---

# 🔑 Keys & Constraints

The database demonstrates several important DBMS concepts.

## Primary Keys

Examples:

```text
CUSTOMER(cust_id)
PROPERTY(property_id)
METER(meter_id)
UTILITY_SERVICE(service_id)
TARIFF(tariff_code)
```

## Composite Keys

Examples:

```text
CUSTOMER_PHONE(cust_id, phone_no)

CUSTOMER_EMAIL(cust_id, email)

CUSTOMER_OWNS_PROPERTY(cust_id, property_id)

METER_READING(meter_id, reading_no)

METER_SERVICE(meter_id, service_id)

BILL(meter_id, billing_month)

PAYMENT(bill_id, payment_sequence)
```

## Specialization / Generalization

### Utility Service

```text
UTILITY_SERVICE
       │
       ├── ELECTRICITY_SERVICE
       └── WATER_SERVICE
```

### Payment

```text
PAYMENT
   │
   ├── CARD_PAYMENT
   ├── CASH_PAYMENT
   └── UPI_PAYMENT
```

These structures demonstrate subtype/specialization modeling in the relational design.

---

# 🔗 Major Relationship Flow

```text
CUSTOMER
   │
   ▼
CUSTOMER_OWNS_PROPERTY
   │
   ▼
PROPERTY
   │
   ▼
PROPERTY_INCORPORATE_METER
   │
   ▼
METER
   │
   ├─────────────► METER_READING
   │
   └─────────────► METER_SERVICE
                         │
                         ▼
                  UTILITY_SERVICE
                     │        │
                     ▼        ▼
              ELECTRICITY   WATER
                 SERVICE    SERVICE

METER
  │
  ▼
BILL
  │
  ▼
PAYMENT
  │
  ├── CARD_PAYMENT
  ├── CASH_PAYMENT
  └── UPI_PAYMENT
```

---

# 🔌 REST API Reference

The backend follows a modular REST architecture.

## API Resource Groups

| Base Route | Responsibility |
|---|---|
| `/api/auth` | Authentication and approval-password verification |
| `/api/customers` | Customer operations |
| `/api/properties` | Property operations |
| `/api/meters` | Meter operations |
| `/api/services` | Utility service operations |
| `/api/bills` | Billing operations |
| `/api/payments` | Payment operations |
| `/api/dashboard` | Dashboard data |
| `/api/readings` | Meter reading operations |
| `/api/reports` | Reporting operations |
| `/api/requests` | General access-request workflow |
| `/api/query` | Query Studio and SQL approval workflow |

## Extended API Structure

### Core Data APIs

```text
GET/POST/PUT/DELETE  /api/customers
GET/POST/PUT/DELETE  /api/properties
GET/POST/PUT         /api/meters
GET/POST             /api/readings
GET                   /api/services
GET                   /api/electricity-services
GET                   /api/water-services
GET                   /api/tariffs
GET/POST/PUT         /api/bills
GET/POST             /api/payments
GET                   /api/payment-schedules
GET                   /api/ownerships
GET                   /api/customer-phones
GET                   /api/customer-emails
GET                   /api/property-meters
GET                   /api/meter-services
GET                   /api/card-payments
GET                   /api/cash-payments
GET                   /api/upi-payments
```

### Dashboard APIs

```text
GET /api/dashboard
GET /api/dashboard/summary
GET /api/dashboard/consumption
GET /api/dashboard/revenue
GET /api/dashboard/bill-status
GET /api/dashboard/payment-methods
```

### Reporting APIs

```text
GET /api/reports/overview
GET /api/reports/monthly
GET /api/reports/bill-status
GET /api/reports/payment-methods
GET /api/reports/top-meters
```

### Query Studio APIs

```text
POST /api/query
GET  /api/query/requests
GET  /api/query/requests/:id
POST /api/query/requests/:id/approve
POST /api/query/requests/:id/reject
```

### Authentication APIs

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-approval
```

---

# 🔐 Authentication API

## Login

```http
POST /api/auth/login
```

Example request:

```json
{
  "username": "testuser",
  "password": "test123",
  "role": "USER"
}
```

A successful login returns a JWT token.

## Registration

```http
POST /api/auth/register
```

Normal registration creates a `USER` account.

The predefined administrator username is reserved and cannot be registered through this endpoint.

## Approval Verification

```http
POST /api/auth/verify-approval
```

This verifies the administrator's second approval password and returns a short-lived approval token.

---

# 🧪 Query Studio API

## Execute or Submit Query

```http
POST /api/query
```

Example:

```json
{
  "query": "SELECT * FROM CUSTOMER LIMIT 3"
}
```

Read-only queries execute immediately.

Write queries are stored as approval requests.

## List Query Requests

```http
GET /api/query/requests
```

## Get Query Request

```http
GET /api/query/requests/:id
```

## Approve Query Request

```http
POST /api/query/requests/:id/approve
```

**Administrator access required.**

## Reject Query Request

```http
POST /api/query/requests/:id/reject
```

**Administrator access required.**

Example:

```json
{
  "rejectionReason": "Operation is not required for the current task."
}
```

---

# 📦 API Response Format

Successful API responses follow:

```json
{
  "success": true,
  "data": {}
}
```

Error responses follow:

```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

This gives the frontend a predictable interface for success and error handling.

---

# 🌐 Frontend Overview

The frontend is organized around the following primary views:

```text
Landing
   ↓
Login
   ↓
Dashboard
   ├── Database Explorer
   ├── Query Studio
   ├── Processing
   ├── Reports
   ├── Customer 360
   ├── Property Portfolio
   ├── Meter Monitor
   ├── Tariff Lab
   ├── Billing Center
   └── Payment Hub
          │
          └── Admin → Approvals
```

### Landing Page

Presents the U/BILL system and provides entry into the application.

### Login

Provides backend-authenticated login with role selection and protected application access.

### Dashboard

Displays live database-backed operational metrics and analytics.

### Database Explorer

Provides interactive table and record inspection.

### Query Studio

Provides SQL execution for read queries and approval-based handling for write queries.

### Processing

Monitors query-request lifecycle states.

### Approvals

Provides administrator-controlled SQL request approval and rejection.

### Operations

Provides domain-specific operational views.

### Reports

Provides aggregated analytics and visual reporting.

---

# 📁 Project Structure

```text
utility-billing-management-system/
│
├── README.md
├── .gitignore
│
├── database/
│   ├── 01_create_database.sql
│   ├── 02_create_tables.sql
│   ├── 03_insert_data.sql
│   ├── 04_basic_queries.sql
│   ├── 05_advanced_queries.sql
│   ├── 06_dashboard_queries.sql
│   ├── 07_create_access_requests.sql
│   ├── 08_create_users.sql
│   └── 09_create_query_requests.sql
│
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── .env.example
│   │
│   ├── config/
│   │   └── database.js
│   │
│   ├── routes/
│   │   ├── customerRoutes.js
│   │   ├── propertyRoutes.js
│   │   ├── meterRoutes.js
│   │   ├── serviceRoutes.js
│   │   ├── billRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── readingRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── queryRoutes.js
│   │   ├── requestRoutes.js
│   │   └── authRoutes.js
│   │
│   ├── controllers/
│   │   ├── customerController.js
│   │   ├── propertyController.js
│   │   ├── meterController.js
│   │   ├── serviceController.js
│   │   ├── billController.js
│   │   ├── paymentController.js
│   │   ├── dashboardController.js
│   │   ├── readingController.js
│   │   ├── reportController.js
│   │   ├── queryController.js
│   │   ├── requestController.js
│   │   └── authController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   │
│   └── utils/
│       └── auth.js
│
└── frontend/
    ├── package.json
    ├── index.html
    └── src/
        ├── components/
        ├── layouts/
        ├── pages/
        │   ├── Landing.jsx
        │   ├── Login.jsx
        │   ├── Dashboard.jsx
        │   ├── DatabaseExplorer.jsx
        │   ├── QueryStudio.jsx
        │   ├── RecordManagement.jsx
        │   ├── AdminPanel.jsx
        │   ├── OperationsHub.jsx
        │   └── Reports.jsx
        │
        ├── services/
        │   ├── api.js
        │   └── auth.js
        │
        ├── styles/
        │   ├── dashboard.css
        │   ├── database-explorer.css
        │   ├── operations.css
        │   ├── query-studio.css
        │   ├── query-studio-crud.css
        │   └── reports.css
        │
        ├── App.jsx
        └── main.jsx
```

---

# 🗂️ SQL Script Organization

The database layer is divided into focused SQL files.

| File | Purpose |
|---|---|
| `01_create_database.sql` | Creates the project database |
| `02_create_tables.sql` | Creates the core relational schema |
| `03_insert_data.sql` | Inserts sample data |
| `04_basic_queries.sql` | Basic SQL queries |
| `05_advanced_queries.sql` | Advanced SQL queries |
| `06_dashboard_queries.sql` | Dashboard and reporting queries |
| `07_create_access_requests.sql` | Creates the general access-request workflow |
| `08_create_users.sql` | Creates the application users table |
| `09_create_query_requests.sql` | Creates the Query Studio approval table |

---

# 🗄️ Database Verification

After initialization:

```sql
USE utility_billing_db;
SHOW TABLES;
```

Verify important relations:

```sql
SELECT COUNT(*) FROM CUSTOMER;
SELECT COUNT(*) FROM PROPERTY;
SELECT COUNT(*) FROM METER;
SELECT COUNT(*) FROM METER_READING;
SELECT COUNT(*) FROM UTILITY_SERVICE;
SELECT COUNT(*) FROM BILL;
SELECT COUNT(*) FROM PAYMENT;
```

Foreign-key relationships can be inspected using:

```sql
SELECT
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'utility_billing_db'
  AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME;
```

---

# 💻 Prerequisites

Install:

- Node.js
- npm
- MySQL Community Server
- Git
- Visual Studio Code

Verify:

```bash
node -v
npm -v
git --version
```

Make sure MySQL Server is running and accessible on the configured port.

---

# 🚀 Installation & Setup

## Step 1 — Clone the Repository

```bash
git clone https://github.com/anubhavarya27/utility-billing-management-system.git
cd utility-billing-management-system
```

---

## Step 2 — Initialize the MySQL Database

Open MySQL Workbench, MySQL Shell, or the MySQL command-line client.

Execute these scripts in order:

```text
01_create_database.sql
02_create_tables.sql
03_insert_data.sql
07_create_access_requests.sql
08_create_users.sql
09_create_query_requests.sql
```

Additional SQL demonstration scripts:

```text
04_basic_queries.sql
05_advanced_queries.sql
06_dashboard_queries.sql
```

---

## Step 3 — Install Backend Dependencies

```bash
cd backend
npm install
```

---

## Step 4 — Configure Environment Variables

Create:

```text
backend/.env
```

Use `.env.example` as the configuration reference.

Required variables:

```text
DB_HOST
DB_USER
DB_PASSWORD
DB_NAME
DB_PORT
PORT
JWT_SECRET
JWT_EXPIRES_IN
ADMIN_USERNAME
ADMIN_PASSWORD_HASH
APPROVAL_PASSWORD_HASH
APPROVAL_TOKEN_EXPIRES_IN
```

Do **not** commit `.env` or database credentials to GitHub.

---

## Step 5 — Start the Backend

From the backend directory:

```bash
node server.js
```

The backend runs on:

```text
http://localhost:5000
```

Test the API root:

```text
http://localhost:5000/
```

---

## Step 6 — Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## Step 7 — Start the Frontend

```bash
npm run dev
```

The development server will display the frontend URL in the terminal.

The frontend communicates with:

```text
http://localhost:5000/api
```

---

# 🪟 Windows PowerShell Note

On Windows systems where PowerShell blocks `npm.ps1`, use:

```powershell
npm.cmd install
npm.cmd run dev
```

This is only a shell/environment issue and does not change the application itself.

---

# ▶️ Running the Complete Application

The complete system requires:

```text
1. MySQL
      ↓
2. Node.js + Express Backend
      ↓
3. React Frontend
```

### Terminal 1 — MySQL

Ensure the MySQL Server is running.

### Terminal 2 — Backend

```bash
cd backend
npm install
node server.js
```

### Terminal 3 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the frontend URL displayed by the development server.

---

# 🔄 End-to-End Workflow

```text
                  U/BILL
                     │
                     ▼
              User Authentication
                     │
                     ▼
              React Application
                     │
                     ▼
              Express REST API
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
     Normal Modules         Query Studio
          │                     │
          ▼                     ▼
       MySQL              SQL Classification
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
                  READ                    WRITE
                    │                       │
                    ▼                       ▼
               Execute Now             PENDING
                                            │
                                            ▼
                                      Admin Review
                                       │       │
                                       ▼       ▼
                                    APPROVE   REJECT
                                       │
                                       ▼
                                   EXECUTING
                                       │
                                  ┌────┴────┐
                                  ▼         ▼
                              COMPLETED   FAILED
```

---

# 🔄 Example Application Workflows

## Normal Login

```text
User
 ↓
Login
 ↓
POST /api/auth/login
 ↓
Credential Verification
 ↓
JWT Generated
 ↓
Authenticated Session
 ↓
Protected Application
```

## Read Query

```text
User
 ↓
Query Studio
 ↓
POST /api/query
 ↓
Server-Side Classification
 ↓
READ
 ↓
Execute Immediately
 ↓
Return Result
```

## Write Query

```text
User
 ↓
Query Studio
 ↓
POST /api/query
 ↓
Server-Side Classification
 ↓
WRITE
 ↓
Create QUERY_REQUEST
 ↓
PENDING
 ↓
Administrator Review
 ├── REJECTED
 └── APPROVED
       ↓
    EXECUTING
       ↓
 COMPLETED / FAILED
```

---

# 🧭 Project Demonstration Flow

A complete academic demonstration can follow:

```text
1. EER Diagram
       ↓
2. Relational Schema
       ↓
3. Normalization / BCNF-Oriented Design
       ↓
4. MySQL Database Creation
       ↓
5. Table & Constraint Creation
       ↓
6. Sample Data Insertion
       ↓
7. Basic SQL Queries
       ↓
8. Advanced SQL Queries
       ↓
9. Dashboard Queries
       ↓
10. Start Node.js Backend
       ↓
11. Verify REST APIs
       ↓
12. Start React Frontend
       ↓
13. Login
       ↓
14. Dashboard
       ↓
15. Database Explorer
       ↓
16. Query Studio — SELECT
       ↓
17. Query Studio — INSERT / UPDATE / DELETE / DDL
       ↓
18. Processing Queue
       ↓
19. Admin Approval / Rejection
       ↓
20. Operations Modules
       ↓
21. Reports & Analytics
       ↓
22. Complete Working System
```

---

# 🧪 Testing Strategy

Testing is performed at multiple levels.

## Database Testing

Verify:

- Database creation
- Table creation
- Primary keys
- Composite keys
- Foreign keys
- Relationships
- Sample data
- Referential integrity

## Backend Testing

Verify:

- API server startup
- Database connectivity
- User authentication
- JWT validation
- Protected routes
- Administrator authorization
- Read-query execution
- Write-query submission
- Mixed-query classification
- Approval workflow
- Rejection workflow
- Transaction execution
- Rollback on DML failure

## Frontend Testing

Verify:

- Login form validation
- User/admin role selection
- API communication
- Dashboard loading
- Entity-management screens
- Query Studio
- Processing/approval interfaces
- Error handling
- Loading states

---

# 🛡️ Security Considerations

U/BILL is an academic project, but the implementation includes meaningful application-level security controls.

### Password Hashing

Passwords are hashed using `bcryptjs`.

### JWT Authentication

Authenticated requests use signed JWT tokens.

### Role-Based Authorization

Administrator-only APIs are protected using backend authorization middleware.

### Second-Level Approval Verification

Sensitive query approval can use an additional approval password and a short-lived approval token.

### Server-Side SQL Classification

The backend independently determines whether submitted SQL is read-only or write-oriented.

### Parameterized Database Operations

Backend database operations use parameterized queries where applicable instead of directly concatenating user-supplied values into SQL.

### Environment-Based Secrets

Database passwords, JWT secrets, and password hashes are stored through environment variables rather than committed source code.

### Frontend Isolation

The React frontend never receives MySQL credentials and never connects directly to the database.

---

# 🧠 DBMS Concepts Demonstrated

U/BILL combines several major DBMS concepts in one working application.

## Database Design

- EER-oriented modeling
- Relational schema design
- Entities
- Attributes
- Relationships
- Cardinality
- Specialization

## Keys

- Primary keys
- Composite keys
- Unique identifiers
- Foreign keys

## Integrity

- Referential integrity
- NOT NULL constraints
- UNIQUE constraints
- Foreign-key constraints
- Relationship-table design
- CHECK constraints

## Specialization

```text
UTILITY_SERVICE
├── ELECTRICITY_SERVICE
└── WATER_SERVICE
```

and:

```text
PAYMENT
├── CARD_PAYMENT
├── CASH_PAYMENT
└── UPI_PAYMENT
```

## SQL

- SELECT
- INSERT
- UPDATE
- DELETE
- JOIN
- GROUP BY
- HAVING
- Aggregate functions
- Filtering
- Sorting
- Subqueries
- CTE-based reads
- Reporting queries

## Transactions

- BEGIN
- COMMIT
- ROLLBACK
- DML batch execution

## Application Integration

- REST APIs
- Connection pooling
- Authentication
- Authorization
- Query classification
- Approval workflows
- React/Node/MySQL integration

---

# 🔬 Query Studio as a DBMS Demonstration

Query Studio provides a controlled database-access mechanism.

Instead of allowing every submitted SQL statement to execute immediately:

```text
Read-only SQL
   └── Immediate Execution

Write SQL
   └── Approval Workflow
```

This creates a controlled boundary between:

- Data retrieval
- Data modification
- Administrative review
- SQL execution
- Execution-result recording

The feature also demonstrates practical transaction processing for approved DML operations.

---

# 📚 Academic Value

The project demonstrates the complete path from database theory to application implementation:

```text
EER Model
   ↓
Relational Schema
   ↓
Keys & Constraints
   ↓
SQL
   ↓
MySQL Database
   ↓
Node.js / Express API
   ↓
Authentication / Authorization
   ↓
React Frontend
   ↓
Controlled Database Operations
```

This connects theoretical DBMS concepts with a practical full-stack software system.

---

# 🎓 Learning Outcomes

Through this project, the team gained practical experience in:

- Relational database design
- EER modeling
- Schema mapping
- Normalization concepts
- Primary keys
- Composite keys
- Foreign keys
- Referential integrity
- SQL
- Transaction processing
- REST API development
- React frontend development
- Frontend/backend integration
- JWT authentication
- Password hashing
- Role-based authorization
- Controlled database access
- Git and GitHub collaboration
- Full-stack application development

---

# 👥 Team Contributions

| Team Member | Registration No. | Role |
|---|---|---|
| **Anubhav Arya** | **25BCE5407** | Frontend Development & System Integration |
| **Tarang Gupta** | **25BCE5383** | Backend & API Development |
| **Amrit Nitin** | **25BCE5385** | Database & SQL Development |

### Arya Anubhav

**Frontend Development & System Integration**

Responsibilities include:

- React frontend development
- User interface implementation
- Navigation
- User interaction flows
- Frontend/API integration
- Application interface

### Tarang Gupta

**Backend & API Development**

Responsibilities include:

- Node.js backend
- Express REST APIs
- Controllers and routes
- JWT authentication
- Role-based authorization
- Query Studio
- SQL classification
- Query approval workflow
- Transaction handling
- Backend/database integration

### Amrit Nitin

**Database & SQL Development**

Responsibilities include:

- MySQL schema
- Database design
- Tables and relationships
- Keys and constraints
- Sample data
- SQL scripts
- Basic SQL queries
- Advanced SQL queries
- Dashboard queries
- Workflow tables

---

# 🔀 Git & Collaboration

The project is developed collaboratively using Git and GitHub.

Major development responsibilities are separated into:

```text
main
├── frontend
├── backend
└── database
```

This allows team members to work independently on assigned layers while maintaining a common repository for integration.

---

# 📈 Development Methodology

The project development process can be summarized as:

```text
Requirement Analysis
        ↓
EER / Conceptual Design
        ↓
Relational Schema
        ↓
SQL Implementation
        ↓
Sample Data
        ↓
Backend API Development
        ↓
Authentication & Authorization
        ↓
Frontend Development
        ↓
Frontend / Backend Integration
        ↓
Query Studio & Approval Workflow
        ↓
Testing & Validation
```

This approach connects the database design directly with the final application.

---

# 🔮 Future Enhancements

Possible future enhancements include:

- PDF bill generation
- Email/SMS billing notifications
- Online payment gateway integration
- Advanced utility-usage analytics
- Usage trend visualization
- Automatic bill generation
- Payment reminders
- Detailed audit logging
- Fine-grained user permissions
- Swagger/OpenAPI documentation
- Automated backend testing
- Docker-based deployment
- Cloud deployment
- Automated backup and recovery
- Production monitoring

---

# 🏁 Conclusion

**U/BILL** transforms a real-world utility billing scenario into a structured relational database and a complete full-stack web application.

The core lifecycle is:

```text
Customer
   ↓
Property
   ↓
Meter
   ↓
Reading
   ↓
Bill
   ↓
Payment
```

while the application also provides:

```text
Authentication
      +
Authorization
      +
Query Classification
      +
Administrator Approval
      +
Transaction Processing
      +
Dashboard & Reporting
```

The project demonstrates how database design, SQL, backend development, frontend development, authentication, authorization, and controlled database operations can be integrated into one practical system.

U/BILL therefore serves both as a functional **Utility Billing Management System** and as a comprehensive demonstration of important **Database Management System** principles.

---

# 📄 License

This project is developed for **academic and educational purposes**.

---

<div align="center">

## ⚡ U/BILL

### Utility Billing Management System

**React · Node.js · Express · MySQL · REST API · JWT · SQL**

**Academic Full-Stack DBMS Project**

</div>
