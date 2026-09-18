# Utility Billing Management System

A relational database-based **Utility Billing Management System** developed as an academic Database Management Systems (DBMS) project. The application combines a React frontend, Node.js/Express REST API backend, and MySQL relational database to manage customers, properties, utility meters, meter readings, utility services, tariffs, bills, and payments.

---

### 🌐 GitHub Repository

**[View Utility Billing Management System →](https://github.com/anubhavarya27/utility-billing-management-system)**

---

## Project Team

* **Frontend Development & System Integration:** Arya Anubhav (25BCE5407)
* **Backend & API Development:** Tarang Gupta (25BCE5383)
* **Database & SQL Development:** Amrit Nitin (25BCE5385)

---

## Table of Contents

* [Project Overview](#project-overview)
* [System Architecture](#system-architecture)
* [Tech Stack](#tech-stack)
* [Key Features](#key-features)
* [Database Design](#database-design)

  * [Entity Relationship Summary](#entity-relationship-summary)
  * [Relational Schema & Tables](#relational-schema--tables)
  * [Database Integrity](#database-integrity)
* [SQL Query Modules](#sql-query-modules)
* [API Overview](#api-overview)
* [Frontend Overview](#frontend-overview)
* [Project Structure](#project-structure)
* [Local Setup Guide](#local-setup-guide)

  * [Prerequisites](#prerequisites)
  * [Step 1: Clone the Repository](#step-1-clone-the-repository)
  * [Step 2: Database Initialization](#step-2-database-initialization)
  * [Step 3: Backend Configuration](#step-3-backend-configuration)
  * [Step 4: Frontend Setup](#step-4-frontend-setup)
  * [Step 5: Run the Complete System](#step-5-run-the-complete-system)
* [Environment Variables](#environment-variables)
* [Database Verification](#database-verification)
* [Security Considerations](#security-considerations)
* [Future Improvements](#future-improvements)
* [Academic Purpose](#academic-purpose)
* [Project Demonstration Flow](#project-demonstration-flow)
* [License & Contributors](#license--contributors)

---

## Project Overview

The **Utility Billing Management System** is an end-to-end application designed to manage utility billing operations using a normalized relational database and a web-based interface.

The system models the complete flow from customers and properties to utility meters, readings, billing, and payments.

### Core Capabilities

* **Customer Management:** Maintain customer information along with multiple phone numbers and email addresses.
* **Property Management:** Maintain properties and their occupancy status.
* **Ownership Management:** Establish customer-property ownership relationships.
* **Meter Management:** Track utility meters, their capacity, installation dates, and operational status.
* **Meter Readings:** Store historical meter readings with reading dates, values, and validation status.
* **Utility Services:** Manage electricity and water services through a common utility-service structure.
* **Tariff Management:** Maintain tariff codes and corresponding unit rates.
* **Billing:** Maintain monthly bills using meter readings and tariff information.
* **Payment Management:** Record payments associated with bills and payment schedules.
* **Payment Methods:** Support Card, Cash, and UPI payment records.
* **Dashboard Analytics:** Provide summary statistics for customers, meters, bills, payments, consumption, revenue, and service usage.

The project follows the workflow:

```text
EER Model
    ↓
Relational Schema
    ↓
Normalization
    ↓
MySQL Database
    ↓
SQL Queries
    ↓
REST API
    ↓
React Frontend
    ↓
Complete Utility Billing System
```

---

## System Architecture

The application follows a decoupled three-tier architecture:

```text
+-------------------------------------------------------------+
|                     React Frontend                          |
|                                                             |
| Dashboard | Customers | Properties | Meters | Services    |
| Bills | Payments | Reports                                 |
+-----------------------------┬-------------------------------+
                              │
                              │ HTTP / JSON
                              ▼
+-------------------------------------------------------------+
|                  Node.js + Express Backend                  |
|                                                             |
| REST API Routes | Controllers | Validation | Error Handling |
+-----------------------------┬-------------------------------+
                              │
                              │ SQL
                              ▼
+-------------------------------------------------------------+
|                         MySQL                               |
|                                                             |
| Customers | Properties | Meters | Readings | Services       |
| Tariffs | Bills | Payments | Payment Methods                |
+-------------------------------------------------------------+
```

### Architecture Breakdown

1. **Frontend Tier**

   * Built using React.
   * Provides the user interface for interacting with customers, properties, meters, services, bills, payments, and reports.
   * Communicates with the backend using HTTP requests and JSON responses.

2. **Backend Tier**

   * Built using Node.js and Express.js.
   * Provides REST API endpoints.
   * Handles request validation and database operations.
   * Acts as the application layer between the frontend and MySQL database.

3. **Database Tier**

   * Built using MySQL.
   * Stores persistent utility billing data.
   * Uses primary keys, foreign keys, composite keys, unique constraints, and check constraints to maintain data integrity.

> **Important:** The React frontend does not connect directly to MySQL. All database operations are handled through the Node.js/Express backend.

---

## Tech Stack

| Component                   | Technology           | Purpose                                       |
| :-------------------------- | :------------------- | :-------------------------------------------- |
| **Frontend**                | React                | User interface and application views          |
| **Client Logic**            | JavaScript           | Frontend functionality and API communication  |
| **Styling**                 | CSS                  | User interface styling                        |
| **Server Runtime**          | Node.js              | Backend runtime environment                   |
| **Web Framework**           | Express.js           | REST API development                          |
| **Database Driver**         | MySQL Node.js Driver | Backend-to-MySQL connectivity                 |
| **Database Engine**         | MySQL                | Relational database management                |
| **Query Language**          | SQL                  | Database creation, manipulation, and analysis |
| **Version Control**         | Git / GitHub         | Source control and team collaboration         |
| **Development Environment** | Visual Studio Code   | Application development                       |

---

## Key Features

### Customer Management

* Add and maintain customer records.
* Store customer name, apartment, flat number, city, and date of birth.
* Maintain multiple phone numbers per customer.
* Maintain multiple email addresses per customer.

### Property Management

* Maintain property records.
* Track property occupancy status.
* Associate customers with properties.
* Record ownership date and ownership type.

### Meter Management

* Maintain utility meter records.
* Track meter capacity.
* Track installation date.
* Track meter status.
* Associate meters with properties.

### Meter Readings

* Store multiple readings for each meter.
* Maintain reading date and reading value.
* Track reading status.
* Support historical consumption analysis.

### Utility Services

* Maintain common utility-service information.
* Support electricity services.
* Support water services.
* Associate services with meters.

### Tariff Management

* Maintain tariff codes.
* Store unit rates for different tariff categories.
* Associate tariffs with bills.

### Billing

* Maintain monthly billing records.
* Store previous and current meter readings.
* Calculate consumption from meter readings.
* Associate bills with tariffs.
* Track bill status.

### Payment Management

* Record payments against bills.
* Support multiple payment records for bills.
* Maintain payment dates and amounts.
* Track payment modes.

### Payment Methods

The system supports:

```text
Payment
 ├── Card Payment
 ├── Cash Payment
 └── UPI Payment
```

Additional information is maintained for each payment type:

* Card number and bank name
* Cash receipt number
* UPI ID and UPI application

### Dashboard & Reports

The database provides queries for:

* Customer statistics
* Property statistics
* Meter statistics
* Active meter count
* Bill status
* Total revenue
* Total payments
* Total consumption
* Monthly consumption
* Monthly revenue
* Payment method distribution
* Top consuming meters
* Customer billing summaries
* Service distribution
* Meter status distribution

---

## Database Design

The relational database consists of **20 relations** derived from the project's EER model and normalized relational schema.

### Entity Relationship Summary

```text
Customer
 ├── Customer_Phone
 ├── Customer_Email
 └── Customer_Owns_Property
              │
              ▼
           Property
              │
              ▼
Property_Incorporate_Meter
              │
              ▼
            Meter
           /    \
          /      \
         ▼        ▼
Meter_Reading   Meter_Service
                    │
                    ▼
             Utility_Service
               /          \
              ▼            ▼
       Electricity       Water
        Service          Service
```

### Billing and Payment Flow

```text
Meter
  │
  ▼
Bill
  │
  ├──────────► Tariff
  │
  ▼
Payment
  │
  ├──► Card_Payment ──► Card
  │
  ├──► Cash_Payment
  │
  └──► UPI_Payment

Payment
  │
  ▼
Payment_Schedule
```

---

## Relational Schema & Tables

|    #   | Table                        | Purpose                                   | Primary Key                   |
| :----: | :--------------------------- | :---------------------------------------- | :---------------------------- |
|  **1** | `Customer`                   | Stores customer information               | `cust_id`                     |
|  **2** | `Customer_Phone`             | Stores customer phone numbers             | `(cust_id, phone_no)`         |
|  **3** | `Customer_Email`             | Stores customer email addresses           | `(cust_id, email)`            |
|  **4** | `Property`                   | Stores property information               | `property_id`                 |
|  **5** | `Customer_Owns_Property`     | Customer-property ownership relationship  | `(cust_id, property_id)`      |
|  **6** | `Meter`                      | Stores utility meter information          | `meter_id`                    |
|  **7** | `Property_Incorporate_Meter` | Associates properties with meters         | `meter_id`                    |
|  **8** | `Meter_Reading`              | Stores historical meter readings          | `(meter_id, reading_no)`      |
|  **9** | `Utility_Service`            | Stores common utility-service information | `service_id`                  |
| **10** | `Electricity_Service`        | Electricity-specific service information  | `service_id`                  |
| **11** | `Water_Service`              | Water-specific service information        | `service_id`                  |
| **12** | `Meter_Service`              | Associates meters with utility services   | `(meter_id, service_id)`      |
| **13** | `Tariff`                     | Stores tariff codes and rates             | `tariff_code`                 |
| **14** | `Bill`                       | Stores monthly utility bills              | `(meter_id, billing_month)`   |
| **15** | `Payment`                    | Stores bill payment records               | `(bill_id, payment_sequence)` |
| **16** | `Payment_Schedule`           | Stores payment due dates                  | `payment_sequence`            |
| **17** | `Card`                       | Stores card information                   | `card_no`                     |
| **18** | `Card_Payment`               | Links payments with cards                 | `payment_id`                  |
| **19** | `Cash_Payment`               | Stores cash payment details               | `payment_id`                  |
| **20** | `UPI_Payment`                | Stores UPI payment details                | `payment_id`                  |

---

## Database Integrity

The database uses several relational integrity mechanisms.

### Primary Keys

Primary keys uniquely identify records in each relation.

Examples:

```text
Customer       → cust_id
Property       → property_id
Meter          → meter_id
Tariff         → tariff_code
Card           → card_no
```

### Composite Primary Keys

Composite keys are used where multiple attributes together identify a relationship or record.

Examples:

```text
Customer_Phone
→ (cust_id, phone_no)

Customer_Email
→ (cust_id, email)

Customer_Owns_Property
→ (cust_id, property_id)

Meter_Reading
→ (meter_id, reading_no)

Meter_Service
→ (meter_id, service_id)

Bill
→ (meter_id, billing_month)

Payment
→ (bill_id, payment_sequence)
```

### Foreign Keys

Foreign keys maintain relationships between the different entities and prevent invalid references.

Examples include:

```text
Customer_Phone.cust_id
    → Customer.cust_id

Customer_Owns_Property.property_id
    → Property.property_id

Meter_Reading.meter_id
    → Meter.meter_id

Bill.meter_id
    → Meter.meter_id

Bill.tariff_code
    → Tariff.tariff_code

Payment.bill_id
    → Bill.bill_id
```

### Check Constraints

The schema uses check constraints to prevent invalid data.

Examples include:

```text
Meter capacity > 0

Meter reading value >= 0

Bill current reading >= previous reading

Payment amount > 0

Tariff unit rate >= 0
```

---

## SQL Query Modules

The database implementation is divided into separate SQL files for development, testing, and demonstration.

```text
database/
├── 01_create_database.sql
├── 02_create_tables.sql
├── 03_insert_data.sql
├── 04_basic_queries.sql
├── 05_advanced_queries.sql
└── 06_dashboard_queries.sql
```

### `01_create_database.sql`

Creates the project database:

```text
utility_billing_db
```

### `02_create_tables.sql`

Creates all 20 relations along with:

* Primary keys
* Foreign keys
* Composite keys
* Unique constraints
* Check constraints
* Referential integrity rules

### `03_insert_data.sql`

Populates the database with sample records for testing and demonstration.

### `04_basic_queries.sql`

Contains fundamental SQL operations including:

* SELECT queries
* Filtering
* Sorting
* Joins
* Service queries
* Meter queries
* Bill queries
* Payment queries

### `05_advanced_queries.sql`

Contains advanced database operations including:

* Aggregate functions
* GROUP BY
* HAVING
* Subqueries
* CASE expressions
* Multi-table joins
* Consumption analysis
* Revenue analysis
* Customer billing analysis

### `06_dashboard_queries.sql`

Contains queries designed to provide dashboard statistics and reporting data.

---

## API Overview

The Node.js/Express backend provides REST API endpoints for communication with the React frontend.

### Customer Endpoints

| Method   | Endpoint             | Description                  |
| :------- | :------------------- | :--------------------------- |
| `GET`    | `/api/customers`     | Retrieve all customers       |
| `GET`    | `/api/customers/:id` | Retrieve a specific customer |
| `POST`   | `/api/customers`     | Create a customer            |
| `PUT`    | `/api/customers/:id` | Update a customer            |
| `DELETE` | `/api/customers/:id` | Delete a customer            |

### Property Endpoints

| Method | Endpoint              | Description                  |
| :----- | :-------------------- | :--------------------------- |
| `GET`  | `/api/properties`     | Retrieve all properties      |
| `GET`  | `/api/properties/:id` | Retrieve a specific property |

### Meter Endpoints

| Method | Endpoint                   | Description               |
| :----- | :------------------------- | :------------------------ |
| `GET`  | `/api/meters`              | Retrieve all meters       |
| `GET`  | `/api/meters/:id`          | Retrieve a specific meter |
| `GET`  | `/api/meters/:id/readings` | Retrieve meter readings   |
| `POST` | `/api/meters/:id/readings` | Add a meter reading       |

### Service Endpoints

| Method | Endpoint                    | Description                   |
| :----- | :-------------------------- | :---------------------------- |
| `GET`  | `/api/services`             | Retrieve utility services     |
| `GET`  | `/api/services/electricity` | Retrieve electricity services |
| `GET`  | `/api/services/water`       | Retrieve water services       |

### Bill Endpoints

| Method | Endpoint         | Description              |
| :----- | :--------------- | :----------------------- |
| `GET`  | `/api/bills`     | Retrieve all bills       |
| `GET`  | `/api/bills/:id` | Retrieve a specific bill |
| `POST` | `/api/bills`     | Create a bill            |
| `PUT`  | `/api/bills/:id` | Update a bill            |

### Payment Endpoints

| Method | Endpoint            | Description                 |
| :----- | :------------------ | :-------------------------- |
| `GET`  | `/api/payments`     | Retrieve payments           |
| `GET`  | `/api/payments/:id` | Retrieve a specific payment |
| `POST` | `/api/payments`     | Create a payment            |

### Dashboard Endpoints

| Method | Endpoint                         | Description                        |
| :----- | :------------------------------- | :--------------------------------- |
| `GET`  | `/api/dashboard/summary`         | Retrieve dashboard summary         |
| `GET`  | `/api/dashboard/consumption`     | Retrieve consumption statistics    |
| `GET`  | `/api/dashboard/revenue`         | Retrieve revenue statistics        |
| `GET`  | `/api/dashboard/bill-status`     | Retrieve bill-status statistics    |
| `GET`  | `/api/dashboard/payment-methods` | Retrieve payment method statistics |

---

## Frontend Overview

The React frontend provides a web-based interface for interacting with the utility billing system.

### Main Views

1. **Dashboard**

   * Displays system-wide billing statistics.
   * Shows consumption and revenue information.
   * Displays bill and payment distributions.

2. **Customers**

   * Displays customer records.
   * Provides customer management functionality.

3. **Properties**

   * Displays property information.
   * Shows occupancy and ownership information.

4. **Meters**

   * Displays meter information.
   * Provides access to meter readings.

5. **Services**

   * Displays available electricity and water services.

6. **Bills**

   * Displays billing records.
   * Shows billing month, readings, tariff, and status.

7. **Payments**

   * Displays payment records.
   * Shows payment amount, date, and payment mode.

8. **Reports**

   * Provides analytical information generated from SQL queries.

---

## Project Structure

```text
utility-billing-management-system/
│
├── README.md
│
├── database/
│   ├── 01_create_database.sql
│   ├── 02_create_tables.sql
│   ├── 03_insert_data.sql
│   ├── 04_basic_queries.sql
│   ├── 05_advanced_queries.sql
│   └── 06_dashboard_queries.sql
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
│   │   └── dashboardRoutes.js
│   │
│   ├── controllers/
│   │   ├── customerController.js
│   │   ├── propertyController.js
│   │   ├── meterController.js
│   │   ├── serviceController.js
│   │   ├── billController.js
│   │   ├── paymentController.js
│   │   └── dashboardController.js
│   │
│   └── middleware/
│       └── errorHandler.js
│
├── frontend/
│   ├── package.json
│   ├── index.html
│   │
│   └── src/
│       ├── components/
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── Customers.jsx
│       │   ├── Properties.jsx
│       │   ├── Meters.jsx
│       │   ├── Services.jsx
│       │   ├── Bills.jsx
│       │   ├── Payments.jsx
│       │   └── Reports.jsx
│       │
│       ├── services/
│       │   └── api.js
│       │
│       ├── App.jsx
│       └── main.jsx
│
└── docs/
    ├── EER.png
    ├── relational-schema.png
    ├── API_CONTRACT.md
    └── PROJECT_SPEC.md
```

---

## Local Setup Guide

Follow these steps to run the project locally.

### Prerequisites

Install the following:

* Node.js
* npm
* MySQL
* Git
* Visual Studio Code

Verify the installations:

```bash
node --version
npm --version
mysql --version
git --version
```

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/anubhavarya27/utility-billing-management-system.git
```

```bash
cd utility-billing-management-system
```

---

### Step 2: Database Initialization

Start MySQL:

```bash
sudo systemctl start mysql
```

Check the MySQL service:

```bash
sudo systemctl status mysql
```

Create the database:

```bash
mysql -u root -p < database/01_create_database.sql
```

Create the tables:

```bash
mysql -u root -p < database/02_create_tables.sql
```

Insert sample data:

```bash
mysql -u root -p < database/03_insert_data.sql
```

---

### Step 3: Backend Configuration

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Configure the database connection inside `.env`.

Example:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=utility_billing_db
```

Start the backend:

```bash
npm run dev
```

If the project uses the standard start script:

```bash
npm start
```

The backend will normally run on:

```text
http://localhost:5000
```

---

### Step 4: Frontend Setup

Open another terminal.

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

The frontend URL will be displayed in the terminal.

---

### Step 5: Run the Complete System

The complete system consists of:

```text
MySQL
   ↓
Node.js + Express Backend
   ↓
React Frontend
```

### Terminal 1 — MySQL

```bash
sudo systemctl status mysql
```

### Terminal 2 — Backend

```bash
cd backend
npm run dev
```

### Terminal 3 — Frontend

```bash
cd frontend
npm run dev
```

Open the frontend URL provided by Vite in your browser.

---

## Environment Variables

The backend uses environment variables for database configuration.

Example `.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=utility_billing_db
```

| Variable      | Description                     |
| :------------ | :------------------------------ |
| `PORT`        | Port used by the Express server |
| `DB_HOST`     | MySQL host                      |
| `DB_USER`     | MySQL username                  |
| `DB_PASSWORD` | MySQL password                  |
| `DB_NAME`     | MySQL database name             |

> **Important:** Never commit the `.env` file to GitHub. Use `.env.example` to document the required variables.

---

## Database Verification

After initializing the database, verify that all tables were created successfully.

Open MySQL:

```bash
sudo mysql
```

Select the database:

```sql
USE utility_billing_db;
```

Display all tables:

```sql
SHOW TABLES;
```

The database should contain the 20 project relations.

You can also verify important row counts:

```sql
SELECT COUNT(*) FROM Customer;
SELECT COUNT(*) FROM Property;
SELECT COUNT(*) FROM Meter;
SELECT COUNT(*) FROM Meter_Reading;
SELECT COUNT(*) FROM Utility_Service;
SELECT COUNT(*) FROM Bill;
SELECT COUNT(*) FROM Payment;
```

Verify foreign-key relationships:

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

Exit MySQL:

```sql
EXIT;
```

---

## Security Considerations

This project was developed for academic and educational purposes.

The following practices are followed:

* Database credentials are stored in environment variables.
* `.env` files should not be committed to GitHub.
* The frontend does not contain database credentials.
* React communicates with MySQL only through the backend API.
* Backend input should be validated before database operations.
* SQL queries should use parameterized values where applicable.
* Database constraints are used to prevent invalid data.

For a production deployment, additional authentication, authorization, encryption, logging, and auditing mechanisms would be required.

---

## Future Improvements

Potential future improvements include:

* [ ] User authentication and authorization
* [ ] Role-based access control
* [ ] Customer login portal
* [ ] Online bill payment interface
* [ ] Automated bill generation
* [ ] Automated payment reminders
* [ ] PDF bill generation
* [ ] CSV/PDF report export
* [ ] Advanced consumption charts
* [ ] Email notifications
* [ ] Database audit logging
* [ ] Cloud deployment
* [ ] Automated testing and CI/CD

---

## Academic Purpose

This project was developed as an academic **Database Management Systems (DBMS)** project to demonstrate:

* Enhanced Entity-Relationship modeling
* Relational schema design
* Database normalization
* BCNF-oriented schema design
* Primary and foreign keys
* Composite keys
* Referential integrity
* Check constraints
* SQL
* MySQL database implementation
* Complex SQL queries
* Aggregate functions
* Multi-table joins
* Subqueries
* REST API development
* Node.js and Express.js
* React frontend development
* Full-stack system integration
* Git and GitHub collaboration

---

## Project Demonstration Flow

The complete project can be demonstrated through the following workflow:

```text
1. EER Diagram
       ↓
2. Relational Schema
       ↓
3. Normalization
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
10. Node.js Backend
       ↓
11. REST API
       ↓
12. React Frontend
       ↓
13. API Integration
       ↓
14. Dashboard & Reports
       ↓
15. Complete Working System
```

---

## License & Contributors

### Contributors

* **Frontend Development & System Integration:** Arya Anubhav (25BCE5407)
* **Backend & API Development:** Tarang Gupta (25BCE5383)
* **Database & SQL Development:** Amrit Nitin (25BCE5385)

### License

This project was developed for academic and educational purposes.
