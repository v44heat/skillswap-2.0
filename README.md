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

Or create the DB manually and let Hibernate auto-create tables on first run:
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

---

## API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/skills/my
POST   /api/skills
PUT    /api/skills/{id}
DELETE /api/skills/{id}
GET    /api/skills/browse

GET    /api/requests/sent
GET    /api/requests/received
POST   /api/requests
PUT    /api/requests/{id}/accept
PUT    /api/requests/{id}/reject
DELETE /api/requests/{id}

GET    /api/sessions/upcoming
GET    /api/sessions/past
PUT    /api/sessions/{id}/complete
PUT    /api/sessions/{id}/cancel

GET    /api/notifications
PUT    /api/notifications/{id}/read
PUT    /api/notifications/read-all
DELETE /api/notifications/{id}

POST   /api/feedback

GET    /api/admin/stats
GET    /api/admin/users
PUT    /api/admin/users/{id}/suspend
POST   /api/admin/users/{id}/reset-password
DELETE /api/admin/users/{id}
GET    /api/admin/skills
PUT    /api/admin/skills/{id}/toggle
DELETE /api/admin/skills/{id}
GET    /api/admin/requests
PUT    /api/admin/requests/{id}/cancel
GET    /api/admin/sessions
PUT    /api/admin/sessions/{id}/cancel
GET    /api/admin/activity
```
