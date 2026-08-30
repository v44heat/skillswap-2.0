# SkillSwap Mobile App

React Native (Expo SDK 51) — connects to the same Spring Boot backend and PostgreSQL database as the web app.

---

## Setup — 4 steps

### 1. Install dependencies

```bash
cd skillswap-mobile
npm install
```

All warnings about deprecated packages are **harmless** — they come from transitive dependencies, not your code.

---

### 2. Set your backend IP address

Open `src/utils/constants.js` and change `API_BASE_URL`:

| Situation | Value |
|-----------|-------|
| Physical Android/iOS phone | `http://YOUR_PC_IP:8080/api` |
| Android emulator | `http://10.0.2.2:8080/api` |
| iOS simulator | `http://localhost:8080/api` |

**Find your PC IP (Windows):**
1. Open Command Prompt
2. Type `ipconfig`
3. Look for **IPv4 Address** e.g. `192.168.1.105`
4. Set: `http://192.168.1.105:8080/api`

> ⚠️ Your phone and PC must be on the **same Wi-Fi network**.

---

### 3. Make sure the backend is running

Start `skillswap-backend` in IntelliJ first (port 8080), then launch the mobile app.

---

### 4. Start the app

```bash
npx expo start
```

- Install **Expo Go** from the Play Store or App Store
- Open Expo Go on your phone → scan the QR code shown in the terminal

---

## Screens

### Student
| Screen | Access |
|--------|--------|
| Login / Register | Unauthenticated |
| Dashboard | Home tab — stats, sessions, notifications |
| Browse Skills | Browse tab — search, filter, request sessions |
| My Requests | Requests tab — sent/received, accept/reject |
| My Sessions | Sessions tab — upcoming/past, complete, rate |
| My Skills | Profile → My Skills button |
| Notifications | Profile → Notifications button |
| Profile | Profile tab — edit info, change password, sign out |

### Admin
| Screen | Tab |
|--------|-----|
| Dashboard Overview | Overview |
| Manage Users | Users |
| Manage Skills | Skills |
| Manage Requests | Requests |
| Manage Sessions | Sessions |
| Activity Logs | Logs |

---

## Default accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@skillswap.com | Admin@123 |
| Student | alex@uni.edu | password123 |
| Student | priya@uni.edu | password123 |

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `Network request failed` | Check `API_BASE_URL` in `constants.js`, ensure backend is running, check same Wi-Fi |
| `ECONNRESET` during install | Run `npm cache clean --force` then `npm install` again |
| Metro bundler error | Run `npx expo start --clear` |
| White / blank screen | Check terminal for JS errors |
| Login fails | Verify backend is running and DB has correct password hashes |
| App crashes on start | Delete `node_modules`, run `npm install` again |
