# Backend Setup Guide

## Step 1 — Fix database password

Open `src/main/resources/application.properties` and change:
```
spring.datasource.password=yourpassword
```
to your actual PostgreSQL password, e.g.:
```
spring.datasource.password=postgres
```

## Step 2 — Create the database

Open pgAdmin or a terminal and run:
```sql
CREATE DATABASE skillswap;
```
Then run the schema file in pgAdmin's Query Tool (open `src/main/resources/schema.sql`).


## Step 3 — Fix IntelliJ stale cache (IMPORTANT if you see ExceptionInInitializerError)

In IntelliJ:
1. **File → Invalidate Caches → Invalidate and Restart**
2. Wait for IntelliJ to re-index
3. In the Maven panel (right side), click the **↻ Reload** button
4. Then run: `SkillSwapApplication`

## Step 4 — Run

Option A — IntelliJ UI:
- Open `src/main/java/com/skillswap/SkillSwapApplication.java`
- Click the green ▶ button next to `main()`

Option B — Terminal inside IntelliJ:
```bash
mvn spring-boot:run
```

Option C — VS Code with terminal:
```bash
mvn spring-boot:run
```

## Verify it started

You should see in the console:
```
Started SkillSwapApplication in X.XXX seconds
Tomcat started on port 8080
```

Test it:
```
GET http://localhost:8080/api/auth/me   → should return 401 (not 500)
```

## Common errors

| Error | Fix |
|-------|-----|
| `Connection refused` to postgres | PostgreSQL isn't running. Start it via Services or `pg_ctl start` |
| `password authentication failed` | Wrong password in application.properties |
| `database "skillswap" does not exist` | Run `CREATE DATABASE skillswap;` in pgAdmin |
| `ExceptionInInitializerError` | File → Invalidate Caches → Invalidate and Restart |
| Port 8080 already in use | Change `server.port=8081` in application.properties |
