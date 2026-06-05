# SkillSwap — Campus Skill Exchange Platform

Full-stack web app: React 18 frontend + Spring Boot 3 backend + PostgreSQL.

---

## Quick Start

### Prerequisites
- Java 17+
- Maven 3.8+ (or use the included `mvnw`)
- Node.js 18+
- PostgreSQL 14+

---

### 1. Database

```bash
psql -U postgres -f skillswap-backend/src/main/resources/schema.sql
```

Or create the DB manually from PGadmin and let Hibernate auto-create tables on first run:
```sql
CREATE DATABASE skillswap;
```

---

### 2. Backend

```bash
cd skillswap-backend

# Edit DB credentials in:
# src/main/resources/application.properties
# Change spring.datasource.password=yourpassword

# Run with Maven wrapper:
./mvnw spring-boot:run

# Or with system Maven:
mvn spring-boot:run

# Or in VS Code:
# Install "Extension Pack for Java" then click Run on SkillSwapApplication.java
```

API runs at **http://localhost:8080**

---

### 3. Frontend

```bash
cd skillswap-frontend
npm install
npm start
```

App runs at **http://localhost:3000**

---

## Default Accounts

| Role    | Email / Student ID     | Password     |
|---------|------------------------|--------------|
| Admin   | admin@skillswap.com    | Admin@123    |
| Student | alex@uni.edu / STU001  | password123  |
| Student | priya@uni.edu / STU002 | password123  |
| Student | james@uni.edu / STU003 | password123  |

---

## Running in VS Code (recommended)

1. Open the `skillswap-backend` folder
2. Install **Extension Pack for Java** (Microsoft)
3. Open `src/main/java/com/skillswap/SkillSwapApplication.java`
4. Click the **▶ Run** button above `main()`

Or use the integrated terminal:
```bash
mvn spring-boot:run
```

---

## Project Structure

```
skillswap/
├── skillswap-backend/          Spring Boot 3 API
│   ├── src/main/java/com/skillswap/
│   │   ├── config/             SecurityConfig, WebConfig (CORS)
│   │   ├── controller/         8 REST controllers
│   │   ├── dto/                Request + Response DTOs
│   │   ├── exception/          Global error handler
│   │   ├── model/              7 JPA entities
│   │   ├── repository/         7 Spring Data repos
│   │   ├── security/           JWT filter + provider
│   │   └── service/            Business logic
│   └── src/main/resources/
│       ├── application.properties
│       └── schema.sql
└── skillswap-frontend/         React 18 SPA
    └── src/
        ├── components/         All pages + UI components
        ├── context/            Auth, Notification, Toast
        ├── hooks/              useAuth, useNotifications, useToast
        ├── services/           Axios service modules
        └── utils/              Constants, helpers
```
