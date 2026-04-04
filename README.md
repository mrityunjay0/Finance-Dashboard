<h1 align="center">FINANCE.OS</h1>

<p align="center">
  <strong>A Premium, Role-Based Financial Management Dashboard built with Spring Boot</strong>
</p>

---

## 📖 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features by Role](#-key-features-by-role)
3. [Technology Stack](#-technology-stack)
4. [Project Structure](#-project-structure)
5. [API Endpoints](#-api-endpoints)
6. [Local Setup & Installation](#-local-setup--installation)
7. [Screenshots & UI Design](#-screenshots--ui-design)

---

## 🎯 Project Overview

**FINANCE.OS** is a full-stack, enterprise-grade financial management system. It is designed to provide secure, real-time insights into system-wide or personal financial health. Rather than relying on heavy Single Page Application (SPA) frameworks like React or Angular, this project demonstrates how to build a highly responsive, modern, and beautiful "glassmorphic" interface using purely **Vanilla HTML/CSS/JS** paired with the power of **Spring Boot** and **Thymeleaf**.

The core architecture strictly enforces **Role-Based Access Control (RBAC)** across both the frontend navigation and backend API controllers, ensuring data security and proper visual abstraction.

---

## 🔐 Key Features by Role

The platform supports three distinct user roles. Upon successful login, the system automatically routes the user to their designated dashboard.

### 🛡️ Administrator (`ADMIN`)
The master account type with unrestricted access to system configurations and raw data.
- **Transaction Management**: Perform full CRUD (Create, Read, Update, Delete) operations on any financial record in the system.
- **User Management**: Register new accounts, update roles/credentials for existing users, and manage access statuses.
- **Advanced Analytics**: View system-wide "Category Distribution" (Income vs Expense breakdown per category) and "Monthly Trends" (month-over-month performance bars).
- **Persistent State**: The dashboard automatically remembers whether the Admin was managing 'Transactions' or 'Users' even after page reloads.

### 📈 Analyst (`ANALYST`)
Designed for data reviewers who need granular insight but should not modify core data.
- **Advanced Filtering**: Search and filter through the entire database of financial records by specifically setting Date Ranges, Record Types (Income/Expense), and Categories.
- **Read-Only Analytics**: Access the same high-level Category and Monthly trend visualizations available to Admins.
- **Action Restriction**: Analysts cannot create, edit, or delete transactions or users.

### 👁️ Viewer (`VIEWER`)
A restricted account tailored for high-level monitoring.
- **Executive Summaries**: Instantly view Net Balance, Total System Income, and Total System Expenses.
- **Visual Dashboards**: See real-time progress bars for categorical spending and dynamic charts for monthly trends.
- **Recent Activity**: Monitor only the most recent system transactions.

---

## 🛠️ Technology Stack

### Backend
- **Java 21**: Leveraging the latest LTS features.
- **Spring Boot 4.0.5**: Core framework.
- **Spring Security**: Form-based authentication, password hashing, and endpoint-level authorization.
- **Spring Data JPA & Hibernate**: Database mapping, querying, and ORM.
- **MySQL**: Persistent relational data storage.
- **Springdoc / Swagger**: Automated API documentation.

### Frontend
- **Thymeleaf**: Server-side rendering for secure routing and customized initial page loads.
- **Vanilla JavaScript (ES6+)**: Handles all `fetch()` calls, DOM updates, modal toggling, and data formatting locally without external libraries.
- **Custom CSS3**: Utilizes CSS variables targeting a premium dark mode, `backdrop-filter` for glassmorphism, flexbox/grid systems, and semantic HTML5.

---

## 🏗️ Project Structure

The project follows a standard, modular Spring Boot MVC architecture, separated cleanly by domain.

```text
dashboard/
├── pom.xml                                  # Maven dependencies and build configuration
├── README.md                                # Project documentation
└── src/
    ├── main/
    │   ├── java/
    │   │   └── com/finance/dashboard/
    │   │       ├── config/                  # Configuration files
    │   │       │   └── SecurityConfig.java  # Spring Security role mapping & auth rules
    │   │       ├── controller/              # HTTP endpoint handlers
    │   │       │   ├── DashboardController.java # Aggregation APIs for analytics
    │   │       │   ├── RecordController.java    # CRUD APIs for Financial Records
    │   │       │   ├── UserController.java      # CRUD APIs for Users
    │   │       │   └── WebController.java       # Thymeleaf HTML routing (/login, /admin...)
    │   │       ├── dto/                     # Data Transfer Objects
    │   │       │   └── ErrorResponse.java   # Standardized error payload
    │   │       ├── entity/                  # Database schema mappings
    │   │       │   ├── FinancialRecord.java 
    │   │       │   └── User.java
    │   │       ├── enums/                   # Allowed constant values
    │   │       │   ├── Category.java        # SALARY, FOOD, INVESTMENT, etc.
    │   │       │   ├── RecordType.java      # INCOME vs EXPENSE
    │   │       │   └── Role.java            # ADMIN, ANALYST, VIEWER
    │   │       ├── exception/               # Global error catching
    │   │       │   └── GlobalExceptionHandler.java # Maps backend exceptions to frontend popups
    │   │       ├── repository/              # JPA Data Access Logic
    │   │       │   ├── FinancialRecordRepository.java
    │   │       │   └── UserRepository.java
    │   │       ├── service/                 # Business logic interfaces
    │   │       │   └── serviceImpl/         # Concrete business logic implementations
    │   │       │       ├── DashboardServiceImpl.java
    │   │       │       ├── FinancialServiceImpl.java
    │   │       │       └── UserServiceImpl.java
    │   │       └── DashboardApplication.java# Application Entry Point
    │   └── resources/
    │       ├── application.properties       # DB connection strings, Hibernate settings
    │       ├── static/                      # Public web assets
    │       │   ├── css/
    │       │   │   └── style.css            # Centralized design system
    │       │   └── js/
    │       │       ├── admin.js             # Logic for Admin CRUD and Analytics
    │       │       ├── analyst.js           # Logic for Analyst Filtering and Analytics
    │       │       └── viewer.js            # Logic for Viewer summaries
    │       └── templates/                   # Secure HTML views
    │           ├── admin.html
    │           ├── analyst.html
    │           ├── login.html
    │           └── viewer.html
    └── test/                                # Unit and Integration tests
```

---

## 📡 API Endpoints

The system relies strongly on a REST approach for asynchronous UI updates. Note: Access to these endpoints is restricted by the roles configured in `SecurityConfig`.

### `DashboardController` (Analytics Data)
- `GET /dashboard/summary`: Returns aggregate totals (Income, Expense, Balance).
- `GET /dashboard/category-total`: Returns Total Income/Expense calculated grouped by Category.
- `GET /dashboard/monthly-trends`: Returns historical Income/Expense aggregates by parsed Month.
- `GET /dashboard/recent-activity`: Returns top 5 most recent records.

### `RecordController` (Financial Management)
- `POST /records/create`: Register a new transaction. *(Admin)*
- `GET /records/{id}`: Fetch specific transaction details. *(All)*
- `GET /records/filter`: Search records using Query Params (`?type=...&category=...`). *(Analyst, Admin)*
- `PUT /records/update/{id}`: Partially update a transaction's fields. *(Admin)*
- `DELETE /records/delete/{id}`: Permanently remove a record. *(Admin)*

### `UserController` (System Access Management)
- `POST /user/create`: Provision new accounts. *(Admin)*
- `GET /user/all`: Retrieve table of all system members. *(Admin)*
- `PUT /user/update/{id}`: Edit user details safely (ignores null fields). *(Admin)*
- `DELETE /user/delete/{id}`: Revoke access permanently. *(Admin)*

---

## 🚀 Local Setup & Installation

### Prerequisites
1. **Java 21 Development Kit (JDK)**
2. **Maven** (Optional, the wrapper `./mvnw` is included)
3. **MySQL Server** running locally at port `3306`.

### Step 1: Database Setup
Launch MySQL and create a dedicated database for this application:
```sql
CREATE DATABASE finance_db;
```

Update your `src/main/resources/application.properties` connection strings to match your local setup:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/finance_db
spring.datasource.username=root
spring.datasource.password=your_secure_password
spring.jpa.hibernate.ddl-auto=update
```

*(Note: `ddl-auto=update` ensures Spring will automatically generate the required `user` and `financial_record` tables on startup).*

### Step 2: Build the Application
Navigate to the root directory `dashboard/` in your terminal and compile the Java code:
```bash
./mvnw clean install
```

### Step 3: Run the Application
Start the Spring Boot Tomcat server:
```bash
./mvnw spring-boot:run
```

### Step 4: Access the Interface
Open a modern web browser and go to:
```text
http://localhost:8080
```
This will route you automatically to `/login`.

*(Important: On first launch, you will need to manually inject an Admin user directly into your MySQL `finance_db.user` table to bypass the login interface, as routes are protected).*

---

## 🎨 Design Philosophy

### Centralized Exception Handling
Instead of letting Tomcat return generic 500 pages, `GlobalExceptionHandler.java` intercepts all backend failures (Validations, 404s, Access Denials) and translates them into a standardized `ErrorResponse` DTO. 
The JavaScript frontend (`admin.js`, `analyst.js`, `viewer.js`) employs a unified `handleResponse()` function. If it detects a non-200 status, it extracts the exact `ErrorResponse.message` and uses a JavaScript popup (`alert`) to immediately explain to the user exactly why the server rejected their action.

### Real-Time Currency Formatting
All JavaScript functions automatically format plain integers into the Indian Rupee (`₹`) locale (`en-IN`), giving the dashboard a precise and professional polish.
